import React, { useState, useCallback } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  CardContent,
  createTheme,
  ThemeProvider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import ReactFlow, { 
  MarkerType,
  addEdge,
  applyEdgeChanges
} from "reactflow";
import "reactflow/dist/style.css";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
      marginBottom: '10px',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const sourceFields = [
  { id: "source-1", name: "source_system", type: "text" },
  { id: "source-2", name: "Brand", type: "varchar" },
  { id: "source-3", name: "source_system_id", type: "integer" },
  { id: "source-4", name: "deluxe_pickup_date", type: "text" },
  { id: "source-5", name: "customer_prospect_ind", type: "varchar" },
  { id: "source-6", name: "business_name", type: "text" },
  { id: "source-7", name: "phone", type: "text" },
  { id: "source-8", name: "cell", type: "text" },
  { id: "source-9", name: "business_type", type: "text" },
  { id: "source-10", name: "lob_cd", type: "text" },
];

const targetFields = [
 
  { id: "target-1", name: "cust_id", type: "text" },
  { id: "target-2", name: "entity_type", type: "varchar(100)" },
  { id: "target-3", name: "business_name_dba", type: "integer" },
  { id: "target-4", name: "business_name_legal_name", type: "varchar(100)" },
  { id: "target-5", name: "business_name_alternative", type: "array" },
  { id: "target-6", name: "business_phone_primary", type: "varchar(100)" },
  { id: "target-7", name: "business_phone_secondary", type: "varchar(100)" },
  { id: "target-8", name: "business_phone_mobile", type: "text" },
  { id: "target-9", name: "source_system", type: "text" },
  { id: "target-10", name: "business_phone_mobile", type: "text" },
];

const MappingDiagram = () => {

  const [nodes, setNodes] = useState([
    ...sourceFields.map((field, index) => ({
      id: field.id,
      position: { x: 50, y: 50 + index * 40 },
      data: { 
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '12px', color:'000000',fontWeight: 'bold' }}>{field.name}</span>
            <span style={{ fontSize: '12px', color: '#666' }}>{field.type}</span>
          </div>
        ) 
      },
      type: 'input',
      sourcePosition: 'right',
      style: { 
        padding: '5px 10px', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: 280,
      },
    })),
    ...targetFields.map((field, index) => ({
      id: field.id,
      position: { x: 550, y: 50 + index * 40 },
      data: { 
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '12px', color:'000000',fontWeight: 'bold'  }}>{field.name}</span>
            <span style={{ fontSize: '12px', color: '#666' }}>{field.type}</span>
          </div>
        ) 
      },
      type: 'output',
      targetPosition: 'left',
      style: { 
        padding: '5px 10px', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: 280,
      },
    })),
  ]);

  const [edges, setEdges] = useState([
    {
      id: "edge-1",
      source: "source-1",
      target: "target-9",
      style: {
        strokeWidth: 2,
        stroke: "#00FF00",
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#00FF00'
      },
    },
    {
      id: "edge-2",
      source: "source-2",
      target: "target-4",
      style: {
        strokeWidth: 2,
        stroke: "#00FF00",
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#00FF00'
      },
    },
    {
      id: "edge-3",
      source: "source-5",
      target: "target-1",
      style: {
        strokeWidth: 2,
        stroke: "#00FF00",
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#00FF00'
      },
    }
  ]);

  const [userChanges, setUserChanges] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const getFieldNameById = (id) => {
    const field = [...sourceFields, ...targetFields].find(f => f.id === id);
    return field ? field.name : id;
  };

  const onConnect = useCallback((params) => {
    const newEdge = { 
      id: `edge-${edges.length + 1}`,
      ...params, 
      animated: true, 
      markerEnd:{
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#FF9F29'
      },
      style: { stroke: '#FF9F29' },
    };
    setEdges((eds) => {
      const filteredEdges = eds.filter(edge => edge.source !== params.source);
      return addEdge(newEdge, filteredEdges);
    });
    setUserChanges((prevChanges) => [
      ...prevChanges, 
      {
        type: 'add',
        source: getFieldNameById(params.source),
        target: getFieldNameById(params.target)
      }
    ]);
  }, [edges]);

  const onEdgesDelete = useCallback((edgesToDelete) => {
    setEdges((eds) => applyEdgeChanges(edgesToDelete.map(edge => ({ id: edge.id, type: 'remove' })), eds));
    edgesToDelete.forEach(edge => {
      setUserChanges((prevChanges) => [
        ...prevChanges, 
        {
          type: 'remove',
          source: getFieldNameById(edge.source),
          target: getFieldNameById(edge.target)
        }
      ]);
    });
  }, []);

  const handleConfirm = () => {
    setOpenConfirmDialog(true);
  };

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: '30px', 
          zIndex: 1000,
          m: 2 // Add some margin
        }}>
          <Button 
            variant="contained" 
            onClick={handleConfirm}
            color="primary"
            size="large"
          >
            Confirm Mapping
          </Button>
        </Box>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        
          <CardContent>
            <Box 
              sx={{ 
                height: '80vh', 
                bgcolor: 'background.paper',
                position: 'relative',
                '& .react-flow__renderer': {
                  borderRadius: 1,
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }
              }}
            >
               <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '10px', 
    borderBottom: '1px solid #ccc'
  }}>
    
  </Box>

           
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onEdgesDelete={onEdgesDelete}
                fitView
                nodesDraggable={false}
                panOnDrag={false}  // This disables panning
                panOnScroll={false}  // This disables panning on scroll
                zoomOnScroll={false}  // This disables zooming on scroll
                zoomOnPinch={false}
              >
              </ReactFlow>
            </Box>
           
          </CardContent>
         
      
      </Container>
      
      <Dialog 
        open={openConfirmDialog} 
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Mapping Changes</DialogTitle>
        <DialogContent>
          <List>
            {userChanges.map((change, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={
                    change.type === 'add' 
                      ? `Added mapping: ${change.source} → ${change.target}`
                      : `Removed mapping: ${change.source} → ${change.target}`
                  }
                />
              </ListItem>
            ))}
          </List>
          {userChanges.length === 0 && (
            <Typography>No changes have been made to the mapping.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            // Here you would typically save the changes
            console.log('Saving changes:', userChanges);
            setOpenConfirmDialog(false);
            setUserChanges([]); // Clear changes after saving
          }} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          .react-flow__node {
            font-size: 12px;
            color: #333;
            text-align: left;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }
          .react-flow__node:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transform: translateY(-2px);
          }
          .react-flow__edge-path {
            stroke-width: 2;
          }
          .react-flow__edge.animated path {
            stroke-dasharray: 5;
            animation: dashdraw 0.5s linear infinite;
          }
          .react-flow__handle {
            width: 2px;
            height: 2px;
            border-radius: 20%;
          }
          .react-flow__attribution a{
            display: none;
            
          }
          @keyframes dashdraw {
            from {
              stroke-dashoffset: 10;
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
};

export default MappingDiagram;