/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react'
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
  const { totalTopics, emptyTopic, user, setTopics } = useEventsStore()

  const handleClick = async (e) => {
    console.log('inserisco nuovo topic vuoto', totalTopics)
    e.preventDefault()
    const id = totalTopics
    console.log('id con new topic: ', id)
    const newTopic = { ...emptyTopic, id, createdBy: user.user.userName, cinema: user.user.cinema }
    const newTopicsAfterAddTopic = await window.api.insertTopic({ topic: newTopic, totalTopics })
    console.log('added topic in DB: ', newTopicsAfterAddTopic)
    setTopics(newTopicsAfterAddTopic)
    /* const getTopicsFromDB = await getTopics();
      console.log("getTopicsFromDb result:", getTopicsFromDB);
      setTopics(getTopicsFromDB); */

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
  const { topics, upDateTopic, setTopics, user } = useEventsStore()
  const [optionsState, setOptionsState] = useState({})
  const [rowModesModel, setRowModesModel] = useState({})

  const options = async () => {
    const getOpt = await window.api.getOptions()
    console.log('options function loading', getOpt)
    setOptionsState({ ...getOpt })
    return getOpt
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id) => () => {
    console.log('quiii')
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => () => {
    console.log('che succede', id, rowModesModel)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id) => async () => {
    console.log('cancello un topic', id)
    const topicsAfterDelete = await window.api.deleteThisTopic({ id })
    setTopics(topicsAfterDelete)
  }

  const handleCancelClick = (id) => async () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })
  }

  const processRowUpdate = async (newRow) => {
    console.log('processRowUpDate', newRow)
    const updatedRow = { ...newRow, isNew: false }
    upDateTopic(updatedRow, newRow.id)
    await window.api.insertTopic({ topic: updatedRow })
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    console.log('handleRowModesModelChange', newRowModesModel)
    setRowModesModel(newRowModesModel)
  }

  // Funzione per gestire l'evento di cambio di stato dei checkbox
  const handleCheckboxChange = (rowId, managerName) => {
    // Troviamo la riga corrispondente a rowId
    const updatedRow = topics.find((row) => row.id === rowId)

    if (updatedRow) {
      const updatedManagers = updatedRow.managers.includes(managerName)
        ? updatedRow.managers.filter((manager) => manager !== managerName)
        : [...updatedRow.managers, managerName]
      const upTopic = { ...updatedRow, managers: updatedManagers }
      // Aggiorna lo stato dell'elemento con la funzione upDateTopic
      upDateTopic(upTopic, rowId)
      return upTopic
    }
  }

  // Funzione per gestire il clic su un link nella cella del datagrid
  const handleLinkClick = (event, rowData) => {
    event.preventDefault() // Impedisci il comportamento predefinito del link
    console.log(rowData)
    if (rowData.value.startsWith('http://') || rowData.value.startsWith('https://')) {
      // Se il link è un URL Internet, aprilo in un browser esterno
      window.api.shell.openExternal(rowData.value)
    } else {
      // Se il link è un percorso di file locale, apri il file
      window.api.shell.openPath(rowData.value)
    }
  }

  // COLUMNS ================================================
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
      //type: 'number',
      width: 110,
      editable: true,
      type: 'singleSelect',
      valueOptions: optionsState.docTypes
    },

    {
      field: 'priority',
      headerName: 'priorità',
      //type: 'number',
      width: 110,
      editable: true,
      type: 'singleSelect',
      valueOptions: priorityTypes
    },
    {
      field: 'link',
      headerName: 'link',
      //type: 'number',
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
      width: 60,
      renderCell: (params) => (
        <ManagerCheckbox
          row={params.row}
          manager={manager}
          onCheckboxChange={(managerName) => {
            handleCheckboxChange(params.row.id, managerName)
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
            console.log('switch', params.row)
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
      //type: 'number',
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
            <>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main'
                }}
                onClick={handleSaveClick(id)}
              />
              ,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </>
          ]
        }

        return [
          <>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </>
        ]
      }
    }
  ]

  //funzione asincrona che prende i topics dal db con una funzione
  // sotto topicsReducer attenzione ch in modalita dev
  //topics si azzera a ogni ricarica della pagina
  const getTopicsFromDb = async () => {
    console.log('getTopicsFromDb triggerato')
    await window.api.getAllTopics().then((args) => {
      /*  for (const element in args.topics) {
        console.log("element: ", element);
      } */
      console.log('getTopicsFromDb result:', args)
      setTopics(args)
    })
  }

  useMemo(() => {
    console.log('usememo di topics', topics, rowModesModel)
    getTopicsFromDb()
  }, [])

  useEffect(() => {
    options()

    return () => {}
  }, [])

  return (
    <Box
      sx={{
        height: 800,
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}
    >
      <DataGrid
        rows={topics}
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
        slots={{
          toolbar: EditToolbar
        }}
        slotProps={{
          toolbar: { setRowModesModel }
        }}
      />
    </Box>
  )
}

export default Topics
