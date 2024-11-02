import { teal } from "@mui/material/colors";
import { enUS } from '@mui/material/locale';
import { createTheme } from "@mui/material/styles";

const defaultPrimaryColor = "#0069b3";
const defaultIconPrimaryColor = "#3f97c0";
const defaultIconHighlightColor = "#1a6aa5";
const defaultSecondaryColor = "#F39200";
const defaultIconSecondaryColor = "#F6A42C";

const muiButtonRoot = {
   padding: 0,
   '&:hover': {
      backgroundColor: "transparent",
   },
   '&:focus': {
      backgroundColor: "transparent",
   }
};

const theme = createTheme({
   components: {
      MuiSlider: {
         styleOverrides: {
            root: {
               width: "6vw",
               height: 2
            },
            colorPrimary: {
               color: "#0069b3 !important"
            },
            rail: {
               color: "inherit !important"
            },
            track: {
               color: "inherit !important",
               border: "none"
            },
            mark: {
               color: "inherit !important"
            },
            thumb: {
               color: "inherit !important",
               width: 12,
               height: 12
            }
         }
      },
      MuiSwitch: {
         styleOverrides: {
            colorPrimary: {
               color: "#fafafa",
               '&.Mui-checked': {
                  color: defaultPrimaryColor
               },
               '&.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: defaultPrimaryColor,
               },
            },
            thumb: {
               color: "inherit"
            }
         }
      },
      MuiTab: {
         styleOverrides: {
            root: {
               ["@media (min-width: 600px)"]: { minWidth: 0 },
               color: '#FFFFFF',
               backgroundColor: defaultPrimaryColor,
               fontSize: 13,
               fontFamily: "Roboto regular",
               opacity: 0.7,
               "&.Mui-selected": {
                  color: "#FFFFFF",
                  opacity: 1
               }
            },
         }
      },
      MuiTabs: {
         styleOverrides: {
            root: {
               backgroundColor: defaultPrimaryColor
            },
            indicator: {
               color: defaultSecondaryColor,
               backgroundColor: defaultSecondaryColor,
               height: "3px",
               padding: "0 !important"
            },
            scrollButtons: {
               color: '#FFFFFF'
            }
         }
      },
      MuiStepIcon: {
         styleOverrides: {
            root: {
               border: "2px solid white",
               borderRadius: "50%",
               "&.Mui-active": {
                  "color": defaultPrimaryColor,
                  "boxShadow": "0 0 0 3px #ffb74d"
               },
               "&.Mui-completed": {
                  "color": defaultPrimaryColor,
               }
            }
         }
      },
      MuiButton: {
         styleOverrides: {
            root: {
               fontFamily: "Roboto medium",
               fontSize: "13px",
               padding: "4px 9px",
               borderRadius: "2px"
            },
            textPrimary: {
               color: defaultPrimaryColor,
               backgroundColor: "#FFFFFF"
            },
            textSecondary: {
               color: defaultPrimaryColor,
            },
            containedPrimary: {
               color: "#FFFFFF",
               backgroundColor: defaultPrimaryColor,
               '&:hover': {
                  backgroundColor: defaultIconHighlightColor
               },
               '&:disabled': {
                  color: "#FFFFFF",
                  borderColor: "#e0e0e0",
               }
            },
            containedSecondary: {
               color: defaultPrimaryColor,
               backgroundColor: "#FFFFFF",
               '&:hover': {
                  backgroundColor: "#e0e0e0"
               }, '&:disabled': {
                  color: "#FFFFFF",
                  borderColor: "#e0e0e0",
               }
            },
            outlinedPrimary: {
               color: "#FFFFFF",
               borderColor: "#FFFFFF",
               label: {
                  color: "inherit"
               },
               '&:hover': {
                  borderColor: "#FFFFFF"
               },
               '&:focus': {
                  color: "#FFFFFF",
                  borderColor: "#FFFFFF",
               },
               '&:disabled': {
                  color: "#FFFFFF",
                  borderColor: "#e0e0e0",
               }
            },
            outlinedSecondary: {
               color: "#FFFFFF",
               borderColor: "red",
               label: {
                  color: "white"
               },
               '&:hover': {
                  borderColor: "red"
               },
               '&:focus': {
                  color: "#FFFFFF",
                  borderColor: "red",
               },
               '&:disabled': {
                  color: "#FFFFFF",
                  borderColor: "#e0e0e0",
               }
            },
         }
      },
      MuiIconButton: {
         styleOverrides: {
            root: muiButtonRoot,
            colorPrimary: {
               color: defaultIconPrimaryColor,
               '&:hover': {
                  color: defaultIconHighlightColor,
                  backgroundColor: "transparent"
               }
            },
            colorSecondary: {
               color: "#FFFFFF",
               '&:hover': {
                  color: "#FFFFFF",
                  backgroundColor: "transparent"
               }
            }
         }
      },
      MuiSvgIcon: {
         styleOverrides: {
            colorPrimary: {
               color: defaultIconPrimaryColor + " !important"
            },
            colorSecondary: {
               color: defaultIconSecondaryColor + " !important"
            }
         }
      },
      MuiCircularProgress: {
         styleOverrides: {
            colorPrimary: {
               color: defaultIconPrimaryColor
            },
            colorSecondary: {
               color: defaultIconSecondaryColor
            },
            root: {
               color: "inherit"
            }
         }
      },
      MuiCheckbox: {
         styleOverrides: {
            colorPrimary: {
               color: '#757575c7',
               '&.Mui-checked': {
                  color: defaultPrimaryColor
               },
               '&.Mui-disabled': {
                  color: '#e0e0e0'
               },
            },
            root: {
               padding: 0
            },
            checked: {},
            disabled: {}
         }
      },
      MuiInput: {
         styleOverrides: {
            underline: {
               '&:after': {
                  borderBottomColor: defaultIconHighlightColor + " !important"
               }
            }
         }
      },
      MuiFilledInput: {
         styleOverrides: {
            underline: {
               '&:after': {
                  borderBottomColor: defaultIconHighlightColor + " !important"
               }
            }
         }
      },
      MuiFormLabel: {
         styleOverrides: {
            root: {
               '&$focused': {
                  color: defaultPrimaryColor
               }
            }
         }
      },
      MuiFormHelperText: {
         styleOverrides: {
            contained: {
               margin: "8 0 0 0"
            }
         }
      },
      MuiRadio: {
         styleOverrides: {
            colorPrimary: {
               '&.Mui-checked': {
                  color: defaultPrimaryColor
               }
            },
            root: {
               padding: "9px !important"
            }
         }
      },
      MuiAppBar: {
         styleOverrides: {
            root: {
               zIndex: 1002
            },
            colorPrimary: {
               backgroundColor: defaultPrimaryColor
            },
            colorSecondary: {
               backgroundColor: "#00bfb2",
               backgroundImage: "linear-gradient(315deg, #00bfb2 0%, #028090 74%)"
            },
            colorDefault: {
               backgroundColor: "rgb(255, 151, 74)"
            }
         }
      },
      MuiTypography: {
         styleOverrides: {
            root: {
               fontFamily: "Roboto regular",
               textPrimary: {
                  color: "#FFFFFF"
               }
            },
            h6: {
               fontSize: '16px'
            },
            h2: {
               fontSize: '2rem'
            },
            body2: {
               fontSize: '0.9rem'
            }
         }
      },
      MuiFab: {
         styleOverrides: {
            root: {
               position: 'absolute',
               bottom: 12,
               right: 12
            },
            primary: {
               backgroundColor: defaultPrimaryColor,
               '&:hover': {
                  backgroundColor: defaultPrimaryColor,
                  opacity: 0.5
               },
               '&:focus': {
                  backgroundColor: defaultPrimaryColor,
                  opacity: 0.5
               },
               '&:active': {
                  backgroundColor: defaultPrimaryColor,
                  opacity: 0.5
               }
            },
            secondary: {
               backgroundColor: '#43a047',
               '&:hover': {
                  backgroundColor: '#43a047 !important'

               },
               '&:focus': {
                  backgroundColor: '#43a047'

               },
               '&:active': {
                  backgroundColor: '#43a047'

               }
            },
            colorInherit: {
               backgroundColor: 'inherit'
            }
         }
      },
      MuiCardActions: {
         styleOverrides: {
            root: {
               padding: '0px'
            }
         }
      },
      MuiBottomNavigationAction: {
         styleOverrides: {
            root: {
               '&$selected': {
                  color: defaultPrimaryColor,
                  label: {
                     color: "inherit"
                  }
               }
            },
            label: {
               '&$selected': {
                  color: "inherit"
               }
            }
         }
      },
      MuiBottomNavigation: {
         styleOverrides: {
            root: {
               color: defaultPrimaryColor
            }
         }
      },
      MuiPaper: {
         styleOverrides: {
            elevation1: {
               boxShadow: "0px 2px 3px -1px rgba(0,0,0,0.2), 0px 1px 5px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"
            }
         }
      },
      MuiSnackbarContent: {
         styleOverrides: {
            message: {
               color: "white !important"
            },
            action: {
               color: "white"
            }
         }
      },
      MuiListSubheader: {
         styleOverrides: {
            colorPrimary: {
               color: 'rgba(0, 0, 0, 0.54)',
               backgroundColor: 'white',
               paddingTop: '16px',
               paddingBottom: '16px'
            },
            sticky: {
               color: 'rgba(0, 0, 0, 0.54)',
               fontSize: '16px',
               backgroundColor: 'white'
            }
         }
      },
      MuiIcon: {
         styleOverrides: {
            fontSizeSmall: {
               fontSize: '16px'
            }
         }
      },
      MuiChip: {
         styleOverrides: {
            label: {
               color: "inherit",
               maxWidth: '31em',
               overflow: 'hidden',
               whiteSpace: 'nowrap',
               textOverflow: 'ellipsis'
            },
            outlinedPrimary: {
               color: "#00897b",
               border: "1px solid #80cbc4",
               backgroundColor: "#e0f2f1 !important"
            },
            colorSecondary: {
               color: "rgba(0, 0, 0, 0.87) !important",
               backgroundColor: "#e3f2fd !important"
            }
         }
      },
      MuiLinearProgress: {
         styleOverrides: {
            colorPrimary: {
               backgroundColor: '#b2dfdb'
            },
            colorSecondary: {
               backgroundColor: '#ffe0b2'
            },
            barColorPrimary: {
               backgroundColor: defaultPrimaryColor
            },
            barColorSecondary: {
               backgroundColor: defaultSecondaryColor
            }
         }
      },
      MuiDrawer: {
         styleOverrides: {
            paper: {
               zIndex: "initial",
               position: "relative",
               backgroundColor: "#fafafa"
            }
         }
      },
      MuiStepper: {
         styleOverrides: {
            root: {
               padding: "24 24 0 24"
            }
         }
      },
      MuiListItemIcon: {
         styleOverrides: {
            root: {
               minWidth: 0
            }
         }
      },
      MuiListItemText: {
         styleOverrides: {
            primary: {
               color: "rgba(0, 0, 0, 0.87)"
            }
         }
      },
      MuiAvatar: {
         styleOverrides: {
            root: {
               '&:hover': {
                  opacity: 0.5
               }
            }
         }
      }, MuiCardContent: {
         styleOverrides: {
            root: {
               '&:last-child': {
                  paddingBottom: "16px"
               }
            }
         }
      },
      MuiDialogContentText: {
         styleOverrides: {
            root: {
               marginBottom: 0
            }
         }
      },
      MuiBadge: {
         styleOverrides: {
            colorPrimary: {
               backgroundColor: defaultSecondaryColor
            },
            colorSecondary: {
               backgroundColor: "#e0e0e0"
            }
         }
      },
      MuiMenuItem: {
         styleOverrides: {
            root: {
               "&.Mui-selected": {
                  backgroundColor: teal[400] + " !important",
                  '&:focus': {
                     backgroundColor: teal[400] + " !important",
                  },
               }
            }
         }
      },
   }
}, enUS);

export default theme;