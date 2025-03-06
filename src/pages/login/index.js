import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login as loginHandle } from "../../store/auth";
import { login } from "../../firebase";
import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControl, FormControlLabel, FormLabel, Link as MuiLink, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {Google} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
    boxShadow: theme.shadows[5],
}));

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setEmailError(!email);
            setPasswordError(!password);
            return;
        }
        try {
            const user = await login(email, password);
            dispatch(loginHandle(user));
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <>
            <CssBaseline />
            <Stack direction="column" justifyContent="center" alignItems="center" height="100vh" px={2}>
                <StyledCard variant="outlined">
                    <Typography component="h1" variant="h5" align="center">
                        Giriş Yap
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailError ? "Geçerli bir email giriniz." : ""}
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Şifre</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordError ? "Şifre en az 6 karakter olmalıdır." : ""}
                                type="password"
                                name="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                            />
                        </FormControl>
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Beni hatırla" />
                        <Button type="submit" fullWidth variant="contained">
                            Giriş Yap
                        </Button>
                    </Box>
                    <Divider>veya</Divider>
                    <Button fullWidth variant="outlined" startIcon={<Google />}>
                        Google ile giriş yap
                    </Button>
                    <Typography align="center">
                        Hesabın yok mu? <MuiLink component={Link} to="/register">Kayıt Ol</MuiLink>
                    </Typography>
                </StyledCard>
            </Stack>
        </>
    );
}
