import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button, TextField, Typography, Paper, AppBar, Toolbar } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    const [inquiry, setInquiry] = useState({ name: '', email: '', message: '' });

    const handleInquirySubmit = (e) => {
        e.preventDefault();
        alert(`Thank you ${inquiry.name}! We have received your inquiry and will contact you soon.`);
        setInquiry({ name: '', email: '', message: '' });
    };

    return (
        <>
            {/* Navigation Bar */}
            <AppBar position="fixed" sx={{ backgroundColor: '#002D62' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        🎓 Genius Academy
                    </Typography>
                    <Box>
                        <Button color="inherit" href="#about">About</Button>
                        <Button color="inherit" href="#features">Features</Button>
                        <Button color="inherit" href="#contact">Contact</Button>
                        <Link to="/choose" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" sx={{ ml: 2, backgroundColor: '#D4AF37', color: '#000' }}>
                                Login
                            </Button>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <HeroSection>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <img src={Students} alt="students" style={{ width: '100%', maxWidth: '500px' }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#002D62', mb: 2 }}>
                            Welcome to
                            <br />
                            <span style={{ color: '#D4AF37' }}>Genius Academy</span>
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#555', mb: 3 }}>
                            Excellence in Education - Peshawar's Premier Institution
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                            Empowering students with world-class education, modern facilities,
                            and dedicated faculty to shape tomorrow's leaders.
                        </Typography>
                        <Box>
                            <Link to="/choose" style={{ textDecoration: 'none' }}>
                                <LightPurpleButton variant="contained" size="large">
                                    Get Started
                                </LightPurpleButton>
                            </Link>
                            <Link to="/Adminregister" style={{ textDecoration: 'none', marginLeft: '16px' }}>
                                <Button variant="outlined" size="large" sx={{ borderColor: '#002D62', color: '#002D62' }}>
                                    Register School
                                </Button>
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </HeroSection>

            {/* About Section */}
            <AboutSection id="about">
                <Container>
                    <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#002D62' }}>
                        About Genius Academy
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FeatureCard elevation={3}>
                                <Typography variant="h4">🏫</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                                    Modern Facilities
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    State-of-the-art classrooms, computer labs, and learning resources.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard elevation={3}>
                                <Typography variant="h4">👨‍🏫</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                                    Expert Faculty
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Highly qualified teachers dedicated to student success.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard elevation={3}>
                                <Typography variant="h4">📊</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                                    Smart Management
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Digital tracking of attendance, grades, and performance.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                    </Grid>
                </Container>
            </AboutSection>

            {/* Features Section */}
            <FeaturesSection id="features">
                <Container>
                    <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 4, color: 'white' }}>
                        Our Features
                    </Typography>
                    <Grid container spacing={3}>
                        {[
                            '✅ Student & Teacher Management',
                            '✅ Attendance Tracking',
                            '✅ Fee Voucher Generation',
                            '✅ Seat Selection System',
                            '✅ Performance Analytics',
                            '✅ Inventory Management'
                        ].map((feature, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Typography variant="h6" sx={{ color: 'white', py: 2 }}>
                                    {feature}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </FeaturesSection>

            {/* Contact/Inquiry Section */}
            <ContactSection id="contact">
                <Container maxWidth="sm">
                    <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#002D62' }}>
                        Send an Inquiry
                    </Typography>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <form onSubmit={handleInquirySubmit}>
                            <TextField
                                fullWidth
                                label="Your Name"
                                value={inquiry.name}
                                onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={inquiry.email}
                                onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Your Message"
                                multiline
                                rows={4}
                                value={inquiry.message}
                                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                                margin="normal"
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{ mt: 2, backgroundColor: '#002D62' }}
                            >
                                Submit Inquiry
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </ContactSection>

            {/* Footer */}
            <Footer>
                <Typography variant="body2" color="white" align="center">
                    © 2024 Genius Academy Management System. All Rights Reserved.
                </Typography>
            </Footer>
        </>
    );
};

export default Homepage;

const HeroSection = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 100px 50px 50px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const AboutSection = styled.section`
    padding: 80px 20px;
    background: #fff;
`;

const FeatureCard = styled(Paper)`
    padding: 30px;
    text-align: center;
    height: 100%;
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-10px);
    }
`;

const FeaturesSection = styled.section`
    padding: 80px 20px;
    background: linear-gradient(135deg, #002D62, #004080);
`;

const ContactSection = styled.section`
    padding: 80px 20px;
    background: #f9f9f9;
`;

const Footer = styled.footer`
    padding: 30px;
    background: #002D62;
`;
