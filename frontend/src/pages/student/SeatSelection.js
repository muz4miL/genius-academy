import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button
} from '@mui/material';
import styled from 'styled-components';

const SeatSelection = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [mySeat, setMySeat] = useState(null);

    const classId = currentUser?.sclassName?._id || currentUser?.sclassName;

    useEffect(() => {
        const fetchSeats = async () => {
            if (!classId) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/SeatList/${classId}`);
                setSeats(response.data);

                // Find if current student already has a seat
                const studentSeat = response.data.find(seat => seat.student === currentUser._id);
                if (studentSeat) {
                    setMySeat(studentSeat._id);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching seats:", error);
                setLoading(false);
            }
        };
        fetchSeats();
    }, [classId, currentUser._id]);

    const handleSeatClick = (seat) => {
        if (seat.isTaken && seat.student !== currentUser._id) return; // Can't click taken seats
        setSelectedSeat(seat._id);
    };

    const handleBookSeat = async () => {
        if (!selectedSeat) return;
        try {
            setLoading(true);
            await axios.put(`${process.env.REACT_APP_BASE_URL}/BookSeat`, {
                seatId: selectedSeat,
                studentId: currentUser._id
            });

            // Refresh seats
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/SeatList/${classId}`);
            setSeats(response.data);
            setMySeat(selectedSeat);
            setSelectedSeat(null);
            setLoading(false);
        } catch (error) {
            console.error("Error booking seat:", error);
            setLoading(false);
        }
    };

    const getSeatColor = (seat) => {
        if (seat._id === selectedSeat) return '#FFA500'; // Orange - selected
        if (seat._id === mySeat) return '#4CAF50'; // Green - my current seat
        if (seat.isTaken) return '#F44336'; // Red - taken by others
        return '#4CAF50'; // Green - available
    };

    const getSeatOpacity = (seat) => {
        if (seat.isTaken && seat._id !== mySeat) return 0.7;
        return 1;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Select Your Seat
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
                    Click on an available seat to select it, then confirm your booking.
                </Typography>

                {/* Legend */}
                <Box display="flex" justifyContent="center" gap={3} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <LegendBox color="#4CAF50" />
                        <Typography variant="body2">Available</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <LegendBox color="#F44336" />
                        <Typography variant="body2">Taken</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <LegendBox color="#FFA500" />
                        <Typography variant="body2">Selected</Typography>
                    </Box>
                </Box>

                {/* Seat Grid - 6 columns x 5 rows = 30 seats */}
                <SeatGrid>
                    {seats.map((seat) => (
                        <SeatBox
                            key={seat._id}
                            onClick={() => handleSeatClick(seat)}
                            style={{
                                backgroundColor: getSeatColor(seat),
                                opacity: getSeatOpacity(seat),
                                cursor: seat.isTaken && seat._id !== mySeat ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {seat.seatNumber}
                        </SeatBox>
                    ))}
                </SeatGrid>

                {/* Book Button */}
                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleBookSeat}
                        disabled={!selectedSeat || loading}
                        sx={{ px: 5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Confirm Seat Booking"}
                    </Button>
                </Box>

                {mySeat && (
                    <Typography variant="body1" align="center" sx={{ mt: 2 }} color="success.main">
                        Your current seat: #{seats.find(s => s._id === mySeat)?.seatNumber}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default SeatSelection;

const SeatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    max-width: 500px;
    margin: 0 auto;
`;

const SeatBox = styled.div`
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
`;

const LegendBox = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: ${props => props.color};
`;
