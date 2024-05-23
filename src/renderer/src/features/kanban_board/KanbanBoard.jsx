/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import Task from './Task'
import DnDContext from './DnDContext'
import './KanbanBoard.css'

const initialTasks = [
  {
    id: '1',
    manager: 'fabioc',
    title: 'Task 1',
    status: 'newtask',
    description: "come e' bello essere qui"
  },
  {
    id: '2',
    manager: 'fabioc',
    title: 'Task 2',
    status: 'newtask',
    description: "come e' bello essere qui"
  },
  {
    id: '3',
    manager: 'roberto',
    title: 'Task 3',
    status: 'newtask',
    description: "come e' bello essere qui"
  },
  {
    id: '4',
    manager: 'fabioc',
    title: 'Task 4',
    status: 'newtask',
    description: "come e' bello essere qui"
  },
  {
    id: '5',
    manager: 'carlo',
    title: 'Task 5',
    status: 'newtask',
    description: "come e' bello essere qui"
  }
]

const KanbanBoard = ({ managerName }) => {
  const [tasks, setTasks] = useState(initialTasks)
  const [columns, setColumns] = useState({})

  const moveTask = (taskId, targetStatus) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task.status === targetStatus) return // Se l'elemento viene rilasciato nella stessa colonna, non fare nulla

    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    setTasks(updatedTasks)

    setColumns((prevColumns) => {
      const sourceColumn = { ...prevColumns[task.status] }
      const targetColumn = { ...prevColumns[targetStatus] }
      sourceColumn.items = sourceColumn.items.filter((item) => item.id !== taskId)
      targetColumn.items = [...targetColumn.items, { ...task, status: targetStatus }]

      return {
        ...prevColumns,
        [task.status]: sourceColumn,
        [targetStatus]: targetColumn
      }
    })
  }

  useEffect(() => {
    const initialColumns = {
      newtask: {
        name: 'New Task',
        items: initialTasks.filter(
          (task) => task.status === 'newtask' && task.manager === managerName
        )
      },
      incharge: {
        name: 'In Charge',
        items: initialTasks.filter(
          (task) => task.status === 'incharge' && task.manager === managerName
        )
      },
      completed: {
        name: 'Completed',
        items: initialTasks.filter(
          (task) => task.status === 'completed' && task.manager === managerName
        )
      },
      blocked: {
        name: 'Blocked',
        items: initialTasks.filter(
          (task) => task.status === 'blocked' && task.manager === managerName
        )
      }
    }
    setColumns(initialColumns)
    return () => {}
  }, [managerName])

  return (
    <div className="kanban-board-container">
      <DnDContext>
        <div className="kanban-board">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              name={column.name}
              items={column.items}
              moveTask={moveTask}
            />
          ))}
        </div>
      </DnDContext>
    </div>
  )
}

// eslint-disable-next-line react/prop-types
const Column = ({ columnId, name, items, moveTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => moveTask(item.id, columnId)
  })

  return (
    <div className={`column ${columnId}`} ref={drop}>
      <h2>{name}</h2>
      <div className="droppable-col">
        {items.map((item, index) => (
          <Task
            key={index}
            id={item.id}
            task={item}
            status={item.status}
            onHandleCardDelete={() => {}}
          />
        ))}
      </div>
    </div>
  )
}

export default KanbanBoard
