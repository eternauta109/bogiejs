import React from "react";

import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Button,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SellIcon from "@mui/icons-material/Sell";
import SchoolIcon from "@mui/icons-material/School";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import Groups2Icon from "@mui/icons-material/Groups2";

const ToggleEvent = ({ setEventType, event }) => {
  const handleToggleAlignment = (alignment) => {
    console.log("Toggle event", alignment);
    let color = "#F39C12";
    switch (alignment) {
      case "evento":
        color = "#F39C12";
        break;
      case "matineè":
        color = "#7DCEA0";
        break;
      case "prevendite":
        color = "#BB8FCE";
        break;
      case "promo":
        color = "#AAB7B8";
        break;
      case "compleanni":
        color = "#448AFF";
        break;
      case "extra":
        color = "#EF5350";
        break;
      case "anteprima":
        color = "#43B5A2";
        break;
      case "maratona":
        color = "#A67FB8";
        break;
      case "visita":
        color = "#FF5733";
        break;
      case "stampa":
        color = "#669999";
        break;
      case "sopraluogo":
        color = "#7859C5";
        break;
      case "meeting":
        color = "#4F7DE5";
        break;
      default:
        console.error("Valore del toggle non previsto:", alignment);
        // Gestire il caso imprevisto, ad esempio impostando un valore di default
        break;
    }
    setEventType({
      ...event,
      eventType: alignment,
      colorEventType: color,
    });
  };

  return (
    <>
      <ToggleButtonGroup
        value={event?.eventType ? event.eventType : "evento"}
        exclusive
        sx={{ mb: 2 }}
        aria-label="text alignment"
      >
        <ToggleButton
          value="evento"
          aria-label="centered"
          onClick={() => handleToggleAlignment("evento")}
        >
          <Tooltip title="evento">
            <EventIcon value="evento" />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          value="matineè"
          aria-label="left aligned"
          onClick={() => handleToggleAlignment("matineè")}
        >
          <Tooltip title="matineè">
            <SchoolIcon />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          value="prevendite"
          aria-label="right aligned"
          onClick={() => handleToggleAlignment("prevendite")}
        >
          <Tooltip title="prevendite">
            <SellIcon />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          value="promo"
          aria-label="justified"
          onClick={() => handleToggleAlignment("promo")}
        >
          <Tooltip title="promo">
            <DevicesOtherIcon />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          value="compleanni"
          aria-label="justified"
          onClick={() => handleToggleAlignment("compleanni")}
        >
          <Tooltip title="compleanni">
            <CelebrationIcon />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          value="extra"
          aria-label="justified"
          onClick={() => handleToggleAlignment("extra")}
        >
          <Tooltip title="extra">
            <RocketLaunchIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={event?.eventType ? event.eventType : "evento"}
        exclusive
        sx={{ mb: 2 }}
        aria-label="text alignment"
      >
        <ToggleButton
          value="anteprima"
          aria-label="justified"
          onClick={() => handleToggleAlignment("anteprima")}
        >
          <Tooltip title="anteprima">
            <MovieCreationIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="maratona"
          aria-label="justified"
          onClick={() => handleToggleAlignment("maratona")}
        >
          <Tooltip title="maratona">
            <DirectionsRunIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="visita"
          aria-label="justified"
          onClick={() => handleToggleAlignment("visita")}
        >
          <Tooltip title="visita">
            <LocalAirportIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="stampa"
          aria-label="justified"
          onClick={() => handleToggleAlignment("stampa")}
        >
          <Tooltip title="evento stampa">
            <PhotoCameraFrontIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="sopraluogo"
          aria-label="justified"
          onClick={() => handleToggleAlignment("sopraluogo")}
        >
          <Tooltip title="sopraluogo">
            <SettingsAccessibilityIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="meeting"
          aria-label="justified"
          onClick={() => handleToggleAlignment("meeting")}
        >
          <Tooltip title="meeting">
            <Groups2Icon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default ToggleEvent;
