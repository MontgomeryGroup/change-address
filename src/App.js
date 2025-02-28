import React, { useState } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    AlertTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

function App() {
    const [companyId, setCompanyId] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);
        setError(null);

        // Ensure the company ID is valid (Adjust length based on HubSpot's format)
        if (!/^\d{10,15}$/.test(companyId)) {
            setError("Invalid Company ID. Please enter a valid numeric ID.");
            setLoading(false);
            return;
        }

        console.log("Sending request with company ID:", companyId);

        try {
            const res = await axios.post(
                "https://update-ad-address.azurewebsites.net/api/update-customer-address?code=sqAl8uxUIisLHUirKswOr6WydEEkUN32YNw-0wW0e1EOAzFuhxkAFQ==",
                { company_id: companyId }
            );

            console.log("API Response:", res.data);

            if (res.data.result?.error) {
                setError(res.data.result.error);
                return;
            }

            if (!res.data.result || Object.keys(res.data.result).length === 0) {
                setError("No customer data available.");
                return;
            }

            setResponse(res.data.result);
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);

            if (error.response?.status === 404) {
                setError("Company not found. Please enter a valid ID.");
            } else {
                setError(error.response?.data?.message || "An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="md" style={{ marginTop: "50px", textAlign: "center" }}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#2A567E" }}>
                Update Customer Address
            </Typography>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <TextField
                    label="Enter Company ID"
                    placeholder="e.g., 12345"
                    variant="outlined"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                />

                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Update"}
                </Button>
            </form>

            {error && (
                <Alert severity="error" style={{ marginTop: "20px" }}>
                    <AlertTitle>Error</AlertTitle>
                    <ErrorIcon style={{ marginRight: "5px", verticalAlign: "middle" }} />
                    {error}
                </Alert>
            )}



            {response && Object.keys(response).length > 0 && Object.values(response).some(db => db.record) && (

                <Card style={{ marginTop: "20px", backgroundColor: "#f4f8fb", boxShadow: "none", padding: "10px" }}>
                    <CardContent>
                        <CheckCircleIcon style={{ color: "#2E7D32", fontSize: "40px" }} />
                        <Typography variant="h6" style={{ fontWeight: "bold", color: "#2A567E" }}>
                            Customer Details Updated Successfully!
                        </Typography>

                        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} centered>
                            {Object.keys(response).map((db, index) => (
                                <Tab key={db} label={db} value={index} />
                            ))}
                        </Tabs>

                        {Object.entries(response).map(([db, details], index) => (
                            selectedTab === index && (
                                <TableContainer component={Paper} style={{ marginTop: "20px" }} key={db}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Field</strong></TableCell>
                                                <TableCell><strong>Value</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {details.record ? (
                                                <>
                                                    <TableRow>
                                                        <TableCell>Customer Code</TableCell>
                                                        <TableCell>{details.record.customerCode || "N/A"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Database</TableCell>
                                                        <TableCell>{db}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Message</TableCell>
                                                        <TableCell>{details.message || "N/A"}</TableCell>
                                                    </TableRow>

                                                    {details.record.customerName && (
                                                        <TableRow>
                                                            <TableCell>Customer Name</TableCell>
                                                            <TableCell>{details.record.customerName}</TableCell>
                                                        </TableRow>
                                                    )}
                                                    {details.record.customerAddress && (
                                                        <TableRow>
                                                            <TableCell>Address</TableCell>
                                                            <TableCell>{details.record.customerAddress}</TableCell>
                                                        </TableRow>
                                                    )}
                                                    {details.record.customerEmail && (
                                                        <TableRow>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell>{details.record.customerEmail}</TableCell>
                                                        </TableRow>
                                                    )}
                                                    {details.record.customerPhone && (
                                                        <TableRow>
                                                            <TableCell>Phone</TableCell>
                                                            <TableCell>{details.record.customerPhone}</TableCell>
                                                        </TableRow>
                                                    )}
                                                    {details.record.customerContact && (
                                                        <TableRow>
                                                            <TableCell>Contact Person</TableCell>
                                                            <TableCell>{details.record.customerContact}</TableCell>
                                                        </TableRow>
                                                    )}
                                                    {details.record.customerCountryName && (
                                                        <TableRow>
                                                            <TableCell>Country</TableCell>
                                                            <TableCell>{details.record.customerCountryName}</TableCell>
                                                        </TableRow>
                                                    )}
                                                    {details.record.customerCurrency && (
                                                        <TableRow>
                                                            <TableCell>Currency</TableCell>
                                                            <TableCell>{details.record.customerCurrency}</TableCell>
                                                        </TableRow>
                                                    )}
                                                    {details.record.vatRegNumber && (
                                                        <TableRow>
                                                            <TableCell>VAT Number</TableCell>
                                                            <TableCell>{details.record.vatRegNumber}</TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2} style={{ textAlign: "center" }}>
                                                        No customer data available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                        ))}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}

export default App;
