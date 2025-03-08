import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../firebase.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Box, Button, Card, CssBaseline, Divider, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase.js";

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

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(email, password, name, lastName);
      if (user) {
          await sendEmailVerification(user);

          alert("Kaydınız başarılı! Lütfen e-postanızı doğruladıktan sonra giriş yapın.");
          await auth.signOut();

          navigate("/");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  return (
      <>
        <CssBaseline />
        <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              px: 2,
            }}
        >
          <StyledCard variant="outlined">
            <Typography component="h1" variant="h5" align="center">
              Kayıt Ol
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  <FontAwesomeIcon icon={faGoogle} style={{ fontSize: 24 }} />
                  <span>|</span>
                  <FontAwesomeIcon icon={faGoogle} style={{ fontSize: 24 }} />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <TextField
                      type="email"
                      label="Ad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      fullWidth
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 45, // Ensure consistent height across inputs
                        },
                      }}
                  />
                  <TextField
                      type="email"
                      label="Soyad"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      fullWidth
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 45, // Ensure consistent height across inputs
                        },
                      }}
                  />
                </Box>

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 45, // Ensure consistent height across inputs
                      },
                    }}
                />

                <TextField
                    label="Şifre"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 45, // Ensure consistent height across inputs
                      },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                  Kayıt Ol
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 2 }}>veya</Divider>

            <Button
                fullWidth
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                sx={{ mb: 2 }}
            >
              Google ile giriş yap
            </Button>

            <Typography align="center">
              Hesabın varsa{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Giriş Yap!
              </Link>
            </Typography>
          </StyledCard>
        </Box>
      </>
  );
}
