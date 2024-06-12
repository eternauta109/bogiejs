/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Box, Typography, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons
} from '@mui/x-data-grid'
import { getOptionsFromDb, getTopicsFromDb } from './api'

import useEventsStore from '../../store/EventDataContext'

import ManagerCheckbox from './ManagerCheckBox'

const priorityTypes = [
  { value: 'none', label: 'none' },
  { value: 'high', label: 'high' },
  { value: 'low', label: 'low' },
  { value: 'medium', label: 'medium' }
]

function EditToolbar(props) {
  const { setRowModesModel } = props
  const { totalTopics, emptyTopic, user, addTopic } = useEventsStore()

  const handleClick = async (e) => {
    console.log('inserisco nuovo topic vuoto', totalTopics)
    e.preventDefault()
    const id = totalTopics
    console.log('id con new topic: ', id)
    const newTopic = {
      ...emptyTopic,
      id,
      createdBy: user.user.userName,
      role: user.user.role,
      area: user.user.area,
      cinema: user.user.cinema
    }
    addTopic(newTopic)

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'topicType' }
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={(e) => handleClick(e)}>
        Add Topic
      </Button>
    </GridToolbarContainer>
  )
}

const Topics = () => {
  const { topics, upDateTopic, setTopics, user, deleteTopic, totalTopics } = useEventsStore()
  const [optionsState, setOptionsState] = useState({})
  const [rowModesModel, setRowModesModel] = useState({})

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id) => async () => {
    await window.api.deleteThisTopic({ id })
    deleteTopic(id)
  }

  const handleCancelClick = (id) => async () => {
    deleteTopic(id)
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })
  }

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    upDateTopic(updatedRow, newRow.id)
    await window.api.insertTopic({ topic: updatedRow, totalTopics })
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const handleCheckboxChange = (rowId, managerName) => {
    const updatedRow = topics.find((row) => row.id === rowId)

    if (updatedRow) {
      const updatedManagers = updatedRow.managers.includes(managerName)
        ? updatedRow.managers.filter((manager) => manager !== managerName)
        : [...updatedRow.managers, managerName]
      const upTopic = { ...updatedRow, managers: updatedManagers }
      upDateTopic(upTopic, rowId)
      return upTopic
    }
  }

  const handleLinkClick = (event, rowData) => {
    event.preventDefault()
    if (rowData.value.startsWith('http://') || rowData.value.startsWith('https://')) {
      window.api.shell.openExternal(rowData.value)
    } else {
      window.api.shell.openPath(rowData.value)
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'dateStart',
      headerName: 'data',
      type: 'date',
      width: 90,
      editable: true
    },
    {
      field: 'topicType',
      headerName: 'topic type',
      type: 'singleSelect',
      valueOptions: optionsState.topicType,
      width: 110,
      editable: true
    },
    {
      field: 'topicArgument',
      headerName: 'argomento',
      width: 420,
      editable: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'office',
      headerName: 'office',
      width: 110,
      editable: true,
      type: 'singleSelect',
      valueOptions: optionsState.officeTypes
    },
    {
      field: 'typeDocument',
      headerName: 'documento',
      width: 110,
      editable: true,
      type: 'singleSelect',
      valueOptions: optionsState.docTypes
    },
    {
      field: 'priority',
      headerName: 'priorità',
      width: 110,
      editable: true,
      type: 'singleSelect',
      valueOptions: priorityTypes
    },
    {
      field: 'link',
      headerName: 'link',
      width: 110,
      editable: true,
      renderCell: (params) =>
        params.row.link !== '' ? (
          <Typography component="div">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => handleLinkClick(event, params)}
            >
              go to link
            </a>
          </Typography>
        ) : null
    },
    ...user.managersName.map((manager) => ({
      field: manager,
      headerName: manager,
      width: 110,
      renderCell: (params) => (
        <ManagerCheckbox
          row={params.row}
          manager={manager}
          onCheckboxChange={(manager) => {
            handleCheckboxChange(params.row.id, manager)
            setRowModesModel({
              ...rowModesModel,
              [params.row.id]: { mode: GridRowModes.Edit }
            })
          }}
        />
      )
    })),
    {
      field: 'tmVeto',
      headerName: 'Tm Veto',
      renderCell: (params) => (
        <Switch
          checked={params.row.tmVeto}
          onChange={(e) => {
            const newVetoState = { ...params.row, tmVeto: e.target.checked }
            upDateTopic(newVetoState, params.row.id)
            setRowModesModel({
              ...rowModesModel,
              [params.row.id]: { mode: GridRowModes.Edit }
            })
          }}
        />
      )
    },
    {
      field: 'note',
      headerName: 'note',
      width: 110,
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'green' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              sx={{ color: 'red' }}
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ]
        }

        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            sx={{ color: 'blue' }}
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            sx={{ color: 'red' }}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ]
      }
    }
  ]

  const getOptions = async () => {
    const result = await getOptionsFromDb()
    setOptionsState(result)
  }

  const getTopics = async () => {
    const result = await getTopicsFromDb()
    const newResult = result !== undefined ? result : { topics: [], totalTopics: 0 }
    setTopics(newResult)
  }

  useEffect(() => {
    getOptions()
    getTopics()
    return () => {}
  }, [])

  return (
    <Box
      sx={{
        height: 900,
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        },
        '& .MuiDataGrid-root': {
          border: '1px solid #ccc',
          borderRadius: '10px'
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid #eee'
        },
        '& .MuiDataGrid-columnsContainer': {
          backgroundColor: '#fafafa'
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#f5f5f5',
          color: '#333',
          fontWeight: 'bold'
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      <DataGrid
        rows={topics ? topics : []}
        columns={columns}
        editMode="row"
        onProcessRowUpdateError={(error) =>
          console.error("Errore durante l'aggiornamento della riga:", error)
        }
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        getRowHeight={() => 'auto'}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar
        }}
        componentsProps={{
          toolbar: { setRowModesModel }
        }}
      />
    </Box>
  )
}

export default Topics
