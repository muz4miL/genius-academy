import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    IconButton,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Inventory = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Asset',
        quantity: 0,
        unitPrice: 0
    });

    const schoolId = currentUser?._id;

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/InventoryList/${schoolId}`);
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (schoolId) fetchItems();
    }, [schoolId]);

    const handleOpenDialog = (item = null) => {
        if (item) {
            setEditItem(item);
            setFormData({
                itemName: item.itemName,
                category: item.category,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            });
        } else {
            setEditItem(null);
            setFormData({ itemName: '', category: 'Asset', quantity: 0, unitPrice: 0 });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditItem(null);
    };

    const handleSubmit = async () => {
        try {
            if (editItem) {
                await axios.put(`${process.env.REACT_APP_BASE_URL}/Inventory/${editItem._id}`, formData);
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/InventoryCreate`, {
                    ...formData,
                    schoolId
                });
            }
            handleCloseDialog();
            fetchItems();
        } catch (error) {
            console.error("Error saving inventory:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/Inventory/${id}`);
                fetchItems();
            } catch (error) {
                console.error("Error deleting inventory:", error);
            }
        }
    };

    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Inventory Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Item
                </Button>
            </Box>

            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">
                    Total Inventory Value: <strong>PKR {totalValue.toLocaleString()}</strong>
                </Typography>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#002D62' }}>
                            <TableCell sx={{ color: 'white' }}>Item Name</TableCell>
                            <TableCell sx={{ color: 'white' }}>Category</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Quantity</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Unit Price</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Total</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.category}
                                        color={item.category === 'Asset' ? 'primary' : 'secondary'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={item.quantity}
                                        color={item.quantity < 5 ? 'error' : 'success'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">PKR {item.unitPrice}</TableCell>
                                <TableCell align="right">PKR {(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleOpenDialog(item)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No inventory items found. Add your first item!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Item Name"
                        value={formData.itemName}
                        onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        select
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        margin="normal"
                    >
                        <MenuItem value="Asset">Asset</MenuItem>
                        <MenuItem value="Supply">Supply</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Unit Price (PKR)"
                        type="number"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({ ...formData, unitPrice: parseInt(e.target.value) })}
                        margin="normal"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editItem ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Inventory;
