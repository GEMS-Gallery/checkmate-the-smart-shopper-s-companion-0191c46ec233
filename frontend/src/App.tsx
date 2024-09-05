import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, List, ListItem, ListItemText, ListItemIcon, IconButton, Checkbox, Box, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { backend } from 'declarations/backend';

interface ShoppingItem {
  id: bigint;
  description: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const result = await backend.getItems();
      setItems(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() !== '') {
      setLoading(true);
      try {
        await backend.addItem(newItem);
        setNewItem('');
        await fetchItems();
      } catch (error) {
        console.error('Error adding item:', error);
      }
      setLoading(false);
    }
  };

  const handleToggleItem = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.toggleItemCompletion(id);
      await fetchItems();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
    setLoading(false);
  };

  const handleDeleteItem = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.deleteItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping List
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleAddItem}>
                <AddIcon />
              </IconButton>
            ),
          }}
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem
                key={Number(item.id)}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.completed}
                    onChange={() => handleToggleItem(item.id)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.description}
                  sx={{ textDecoration: item.completed ? 'line-through' : 'none' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default App;
