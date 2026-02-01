import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import { getAllSclasses, getClassStudents } from '../../redux/sclassRelated/sclassHandle';
import { generateFee } from '../../redux/feeRelated/feeHandle';
import jsPDF from 'jspdf';

const FeeVoucher = () => {
    const dispatch = useDispatch();
    const { sclassesList, sclassStudents, loading: classLoading } = useSelector((state) => state.sclass);
    // const { loading: feeLoading } = useSelector((state) => state.fee);

    const [classID, setClassID] = useState('');
    const [studentID, setStudentID] = useState('');
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState('January');
    const [loader, setLoader] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        dispatch(getAllSclasses(null, "Sclass"));
    }, [dispatch]);

    const handleClassChange = (event) => {
        const selectedClassID = event.target.value;
        setClassID(selectedClassID);
        setStudentID('');
        dispatch(getClassStudents(selectedClassID));
    };

    const generatePDF = (studentName, className, rollNum) => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
        const pageWidth = doc.internal.pageSize.getWidth();
        const sectionWidth = pageWidth / 3;

        const drawSection = (xOffset, title) => {
            doc.setDrawColor(0);
            doc.rect(xOffset + 5, 10, sectionWidth - 10, 180); // Border

            doc.setFontSize(14);
            doc.text("Genius Academy", xOffset + sectionWidth / 2, 20, { align: "center" });

            doc.setFontSize(10);
            doc.text("School Management System", xOffset + sectionWidth / 2, 26, { align: "center" });

            doc.setFontSize(12);
            doc.text(title, xOffset + sectionWidth / 2, 35, { align: "center" }); // Copy Title

            doc.line(xOffset + 10, 38, xOffset + sectionWidth - 10, 38);

            doc.setFontSize(10);
            doc.text(`Student: ${studentName}`, xOffset + 10, 50);
            doc.text(`Roll No: ${rollNum}`, xOffset + 10, 60);
            doc.text(`Class: ${className}`, xOffset + 10, 70);
            doc.text(`Month: ${month}`, xOffset + 10, 80);

            doc.text(`Fee Amount: PKR ${amount}`, xOffset + 10, 100);
            doc.text(`Late Fee: 0`, xOffset + 10, 110);
            doc.text(`Total: PKR ${amount}`, xOffset + 10, 120);

            doc.line(xOffset + 10, 130, xOffset + sectionWidth - 10, 130);

            doc.text("Signature: ____________", xOffset + 10, 160);
        };

        drawSection(0, "Bank Copy");
        drawSection(sectionWidth, "Institute Copy");
        drawSection(sectionWidth * 2, "Student Copy");

        doc.save(`${studentName}_${month}_Challan.pdf`);
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoader(true);

        const feeData = {
            studentId: studentID,
            month: month,
            amount: amount,
        };

        // Call backend to save record
        await dispatch(generateFee(feeData));

        // Find details for PDF
        const selectedStudent = sclassStudents.find(student => student._id === studentID);
        const selectedClass = sclassesList.find(sclass => sclass._id === classID);

        if (selectedStudent && selectedClass) {
            generatePDF(selectedStudent.name, selectedClass.sclassName, selectedStudent.rollNum);
        }

        setLoader(false);
    };

    return (
        <Box sx={{ flex: '1 1 auto', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
                maxWidth: 550,
                px: 3,
                py: '100px',
                width: '100%'
            }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3 }} align="center">
                        Generate Fee Voucher
                    </Typography>

                    <form onSubmit={submitHandler}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Select Class"
                                    value={classID}
                                    onChange={handleClassChange}
                                    required
                                >
                                    {sclassesList && sclassesList.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.sclassName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Select Student"
                                    value={studentID}
                                    onChange={(e) => setStudentID(e.target.value)}
                                    required
                                    disabled={!classID}
                                >
                                    {sclassStudents && sclassStudents.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.name} (Roll: {option.rollNum})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    required
                                >
                                    {months.map((m) => (
                                        <MenuItem key={m} value={m}>
                                            {m}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Fee Amount (PKR)"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Generate Bank Challan"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default FeeVoucher;
