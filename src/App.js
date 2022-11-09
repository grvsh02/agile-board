import React, {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import uuid from "uuid/v4";

const itemsFromBackend = [
    { id: uuid(), content: "First task" },
    { id: uuid(), content: "Second task" },
    { id: uuid(), content: "Third task" },
    { id: uuid(), content: "Fourth task" },
    { id: uuid(), content: "Fifth task" }
];

const columnsFromBackend = {
    [uuid()]: {
      name: "Requested",
      items: itemsFromBackend
    },
    [uuid()]: {
      name: "To do",
      items: []
    },
    [uuid()]: {
      name: "In Progress",
      items: []
    },
    [uuid()]: {
      name: "Done",
      items: []
    }
};


const App = () => {
  const [columns, setColumns] = useState(columnsFromBackend);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const onAddColumn = () => {
    const newColumn = {
        name: "new Column",
        items: []
    }
    setColumns({
      ...columns,
      [uuid()]: newColumn
    })
  }

  const onAddCard = (columnId) => {
      console.log(columnId)
    const newCard = {
        id: uuid(),
        content: "new card"
    }
    const column = columns[columnId];
    const copiedItems = [...column.items];
    copiedItems.push(newCard);
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: copiedItems
      }
    });
  }

  const handleColumnNameChange = (value, columnID) => {
      console.log(columns)
      console.log("value", value.currentTarget.value, "columnID", columnID)
      console.log(columns[columnID])
      columns[columnID]["name"] = value.currentTarget.value
      setColumns(columns)
      console.log(columns)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}} key={columnId}>
              <div style={{height:100, display: "flex", justifyContent: "center", alignItems: "center",}}>
                <input style={{fontSize: 22, border: "none", textAlign: "center", background: "none"}} value={column.name} onChange={value => handleColumnNameChange(value, columnId)} />
              </div>
              <div style={{ marginLeft: 8, marginRight: 8, padding: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div {...provided.droppableProps} ref={provided.innerRef} style={{
                          background: snapshot.isDraggingOver ? "lightblue" : "lightgrey", padding: 8, width: 250,
                          minHeight: 600 }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index} >
                              {(provided, snapshot) => {
                                return (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                       style={{ userSelect: "none", padding: 16, margin: "0 0 8px 0", minHeight: "50px",
                                        backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86", color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
                <div style={{ userSelect: "none", display: "flex", justifyContent: "center", alignItems: "center",
                    paddingLeft: 16, paddingRight: 16, paddingTop: 2, paddingBottom: 2, width: 224, margin: "0 0 8px 0",
                    minHeight: "50px", color: "white", border: "dashed white", cursor: "pointer",
                    }} onClick={() => onAddCard(columnId)}
                >
                    + Add Card
                </div>
            </div>
          );
        })}
      </DragDropContext>
      <div
          style={{
              width: 40, height:500, border: "dashed white",
              display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100, justifyContent: "center",
              cursor: "pointer"
          }}
          onClick={onAddColumn}
      >
        +
      </div>
    </div>
  );
}

export default App;
