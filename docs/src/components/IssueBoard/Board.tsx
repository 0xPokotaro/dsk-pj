import {useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
import type {DropResult} from '@hello-pangea/dnd';
import {initialTasks, statusOrder, statusLabel, STORAGE_KEY} from './data';
import type {Task, Status} from './data';
import TaskModal from './TaskModal';
import styles from './styles.module.css';

function loadTasks(): Task[] {
  if (typeof window === 'undefined') {
    return initialTasks;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialTasks;
    }
    const saved: Task[] = JSON.parse(raw);
    const savedIds = new Set(saved.map((t) => t.id));
    const merged = [...saved, ...initialTasks.filter((t) => !savedIds.has(t.id))];
    return merged;
  } catch {
    return initialTasks;
  }
}

export default function Board(): ReactNode {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const draggedRef = useRef(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function handleDragStart() {
    draggedRef.current = false;
  }

  function handleDragEnd(result: DropResult) {
    draggedRef.current = true;
    const {destination, draggableId} = result;
    if (!destination) {
      return;
    }
    const newStatus = destination.droppableId as Status;
    setTasks((prev) =>
      prev.map((task) => (task.id === draggableId ? {...task, status: newStatus} : task)),
    );
  }

  function handleCardClick(taskId: string) {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    setSelectedTaskId(taskId);
  }

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.columns}>
        {statusOrder.map((status) => {
          const columnTasks = tasks.filter((task) => task.status === status);
          return (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  className={`${styles.column} ${snapshot.isDraggingOver ? styles.columnOver : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  <div className={styles.columnHeader}>
                    <span>{statusLabel[status]}</span>
                    <span className={styles.count}>{columnTasks.length}</span>
                  </div>
                  <div className={styles.columnBody}>
                    {columnTasks.map((task, index) => (
                      <Draggable draggableId={task.id} index={index} key={task.id}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            onClick={() => handleCardClick(task.id)}
                            className={`${styles.card} ${dragSnapshot.isDragging ? styles.cardDragging : ''}`}>
                            <span className={styles.cardGroup}>{task.group}</span>
                            <span className={styles.cardTitle}>{task.title}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columnTasks.length === 0 && (
                      <div className={styles.emptyColumn}>ここにドラッグ</div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTaskId(null)} />}
    </DragDropContext>
  );
}
