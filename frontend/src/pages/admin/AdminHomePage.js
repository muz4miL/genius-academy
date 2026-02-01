import { Container, Grid, Paper, Box, Typography, Chip } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import axios from 'axios';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import InventoryIcon from '@mui/icons-material/Inventory';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user);
    const adminID = currentUser._id;

    const [inventoryStats, setInventoryStats] = useState({ totalValue: 0, lowStockCount: 0, totalItems: 0 });
    const [seatStats, setSeatStats] = useState({ totalSeats: 0, takenSeats: 0, occupancyPercent: 0 });

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));

        // Fetch Inventory Stats
        const fetchInventoryStats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/InventoryStats/${adminID}`);
                setInventoryStats(response.data);
            } catch (error) {
                console.error("Error fetching inventory stats:", error);
            }
        };

        fetchInventoryStats();
    }, [adminID, dispatch]);

    // Fetch Seat Stats when classes are loaded
    useEffect(() => {
        const fetchSeatStats = async () => {
            if (sclassesList && sclassesList.length > 0) {
                let totalSeats = 0;
                let takenSeats = 0;

                for (const sclass of sclassesList) {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/SeatList/${sclass._id}`);
                        const seats = response.data;
                        totalSeats += seats.length;
                        takenSeats += seats.filter(s => s.isTaken).length;
                    } catch (error) {
                        console.error("Error fetching seats for class:", error);
                    }
                }

                const occupancyPercent = totalSeats > 0 ? Math.round((takenSeats / totalSeats) * 100) : 0;
                setSeatStats({ totalSeats, takenSeats, occupancyPercent });
            }
        };

        fetchSeatStats();
    }, [sclassesList]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Row 1: Core Stats */}
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Students} alt="Students" />
                            <Title>Total Students</Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Classes} alt="Classes" />
                            <Title>Total Classes</Title>
                            <Data start={0} end={numberOfClasses} duration={5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Teachers} alt="Teachers" />
                            <Title>Total Teachers</Title>
                            <Data start={0} end={numberOfTeachers} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Fees} alt="Fees" />
                            <Title>Inventory Value</Title>
                            <Data start={0} end={inventoryStats.totalValue} duration={2.5} prefix="PKR " />
                        </StyledPaper>
                    </Grid>

                    {/* Row 2: Intelligence Cards */}
                    <Grid item xs={12} md={4}>
                        <IntelCard sx={{ backgroundColor: '#FFF3E0' }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <WarningIcon sx={{ fontSize: 40, color: '#FF9800' }} />
                                <Box>
                                    <Typography variant="h6">Low Stock Alert</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E65100' }}>
                                        {inventoryStats.lowStockCount}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Items with quantity &lt; 5
                                    </Typography>
                                </Box>
                            </Box>
                        </IntelCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <IntelCard sx={{ backgroundColor: '#E8F5E9' }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <EventSeatIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
                                <Box>
                                    <Typography variant="h6">Seat Occupancy</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                        {seatStats.occupancyPercent}%
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {seatStats.takenSeats} of {seatStats.totalSeats} seats taken
                                    </Typography>
                                </Box>
                            </Box>
                        </IntelCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <IntelCard sx={{ backgroundColor: '#E3F2FD' }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <InventoryIcon sx={{ fontSize: 40, color: '#1976D2' }} />
                                <Box>
                                    <Typography variant="h6">Total Inventory</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0D47A1' }}>
                                        {inventoryStats.totalItems}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Tracked items
                                    </Typography>
                                </Box>
                            </Box>
                        </IntelCard>
                    </Grid>

                    {/* Notices */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};


const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

const IntelCard = styled(Paper)`
  padding: 24px;
  border-radius: 12px;
  height: 100%;
`;

export default AdminHomePage