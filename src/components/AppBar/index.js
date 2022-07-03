import { useContext, useState } from "react";

import { Button, CardMedia, IconButton, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";

import { useTheme } from "@emotion/react";

import groupomaniaIcon from "../../assets/img/icon.png";

const pages = [
  { label: "Accueil", url: "/", auth: true },
  { label: "Connexion", url: "/login", auth: false },
  { label: "Inscription", url: "/register", auth: false },
];

const settings = [
  { label: "Profil", url: "/profil" },
  { label: "Déconnexion", url: null },
];

const AppBarComponent = ({ refreshToken }) => {
  const { userData } = useContext(AppContext);

  const isDesktop = useMediaQuery(useTheme().breakpoints.up("md"));

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (url) => {
    navigate(url);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (url) => {
    if (url) {
      navigate(url);
    } else {
      refreshToken(null);
      navigate("/login");
    }

    setAnchorElUser(null);
  };

  return (
    <AppBar sx={{ top: 0, backgroundColor: "#4e5166" }} position="sticky">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ justifyContent: { xs: "space-between" } }}
        >
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            
          </Typography> */}

          <CardMedia
            component="img"
            height="50px"
            sx={{
              display: { xs: "none", md: "block" },
              objectFit: "cover",
              objectPosition: "center",
              width: 150,
            }}
            onClick={() => navigate("/")}
            image={groupomaniaIcon}
            alt={"logo groupomania"}
          />

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => {
                const { label, auth, url } = page;
                if (auth && !userData) return null;
                else if (!auth && userData) return null;
                else
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => handleCloseNavMenu(url)}
                    >
                      <Typography textAlign="center">{label}</Typography>
                    </MenuItem>
                  );
              })}
            </Menu>
          </Box>
          <CardMedia
            component="img"
            height="50px"
            sx={{
              display: { xs: "block", md: "none" },
              objectFit: "cover",
              objectPosition: "center",
              width: 150,
            }}
            onClick={() => navigate("/")}
            image={groupomaniaIcon}
            alt={"logo groupomania"}
          />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => {
              const { label, auth, url } = page;

              if (auth && !userData) return null;
              else if (!auth && userData) return null;
              else
                return (
                  <Button
                    key={index}
                    onClick={() => handleCloseNavMenu(url)}
                    sx={{ my: 2, color: "#FFF", display: "block" }}
                  >
                    {label}
                  </Button>
                );
            })}
          </Box>

          {userData && (
            <Box sx={{ flexGrow: 0 }}>
              <Box display="flex" alignItems="center">
                {isDesktop && (
                  <Typography sx={{ mr: 1 }}>
                    Hello{" "}
                    {userData.isAdmin ? "Administrateur" : userData.firstName}{" "}
                    👋
                  </Typography>
                )}
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{ border: "1.5px solid #FFF" }}
                    alt={userData.firstName}
                    src={userData.imageUrl || ""}
                  >
                    {userData.firstName.charAt(0)}
                  </Avatar>
                </IconButton>
              </Box>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => {
                  const { label, url } = setting;

                  return (
                    <MenuItem
                      key={index}
                      onClick={() => handleCloseUserMenu(url)}
                    >
                      <Typography textAlign="center">{label}</Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default AppBarComponent;
