import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

// eslint-disable-next-line react/prop-types
export default function DnDContext({ children }) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}
