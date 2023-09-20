/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import React, { useEffect, useState } from "react";
import { SpecialKey } from "@itwin/appui-abstract";
import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  useActiveViewport,
  Widget,
  WidgetState
} from "@itwin/appui-react";
import { BackgroundMapType } from "@itwin/core-common";
import { IModelApp, NotifyMessageDetails, OutputMessagePriority } from "@itwin/core-frontend";
import { SvgHelpCircularHollow } from "@itwin/itwinui-icons-react";
import { Alert, Button, IconButton, Input, Label, Text, ToggleSwitch } from "@itwin/itwinui-react";
import { GlobalDisplayApi } from "./GlobalDisplayApi";
import "./GlobalDisplay.scss";

const GlobalDisplayWidget = () => {
  const viewport = useActiveViewport();
  /** Place name to which to travel. */
  const [destination, setDestination] = useState<string>("Orla do Guaíba");
  /** True for 3d terrain, false for a flat map. */
  const [terrain, setTerrain] = useState<boolean>(false);
  /** Display map labels with the map imagery. */
  const [mapLabels, setMapLabels] = useState<boolean>(false);
  /** Display 3d building meshes from Open Street Map Buildings. */
  const [buildings, setBuildings] = useState<boolean>(false);
  /** If buildings are displayed, also display their edges. */
  const [buildingEdges, setBuildingEdges] = useState<boolean>(false);

  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    if (viewport) {
      viewport.changeBackgroundMapProps({
        applyTerrain: terrain,
      });
      viewport.changeBackgroundMapProvider({ type: mapLabels ? BackgroundMapType.Hybrid : BackgroundMapType.Aerial });
    }
  }, [viewport, terrain, mapLabels]);

  useEffect(() => {
    if (viewport) {
      viewport.displayStyle.setOSMBuildingDisplay({ onOff: buildings });
    }
  }, [viewport, buildings]);

  useEffect(() => {
    if (viewport) {
      viewport.viewFlags = viewport.viewFlags.with("visibleEdges", buildingEdges);
    }
  }, [viewport, buildingEdges]);

  const _travelToDestination = async () => {
    if (!viewport)
      return;
    const locationFound = await GlobalDisplayApi.travelTo(viewport, destination);
    if (!locationFound) {
      const message = `Sorry, "${destination}" isn't recognized as a location.`;
      IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Warning, message));
    }
  };

  const _onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === SpecialKey.Enter || e.key === SpecialKey.Return) {
      _travelToDestination()
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  };

  const initialMachines = [
    { numeroDePessoas: 0, peso: 0 },
    { numeroDePessoas: 0, peso: 0 },
    { numeroDePessoas: 0, peso: 0 },
    { numeroDePessoas: 0, peso: 0 },
    { numeroDePessoas: 0, peso: 0 }
  ];

const [machines, setMachines] = useState(initialMachines);

const randomizePeople = () => Math.floor(Math.random() * 300) + 50;

const calculateWeight = (numOfPeople: number) => numOfPeople * 0.15;


const updateMachines = () => {
  const updatedMachines = machines.map(() => {
    const numeroDePessoas = randomizePeople();
    const peso = calculateWeight(numeroDePessoas);
    return { numeroDePessoas, peso };
  });
  setMachines(updatedMachines);
};

  const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button onClick={onClose}>Close</button>
          <p> {machines.map((machine, index) => (
  <div key={index}>
    <h3>Machine {index + 1}</h3>
    <p>Number of discards: {`${machine.numeroDePessoas}`}</p>
    <p>Current weight: {`${machine.peso.toFixed(2)} lb | Maximum: 100 lb`}</p>
  </div>
))}</p>
        </div>
      </div>
    );
  };
  
  const infoLabel = (label: string, tooltip: string) => (
    <span className="toggle-label">
      <Text>{label}</Text>
      <IconButton size="small" styleType="borderless" title={tooltip}><SvgHelpCircularHollow /></IconButton>
    </span>
  );

  return (
    <div className="sample-container">
      <div className="sample-options">
        <div className="sample-options-toggles">
        </div>
  
    
    <div className="travel-destination">
      <Button
        size="large"
        className="travel-destination-btn"
        styleType="cta"
        onClick={() => {
          setIsModalOpen(true);
          updateMachines();
      }}
        title={"Administrate machines"}
      >
        Administrate machines
      </Button>
    </div>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  </div>
      </div>
    
  );

};



export class GlobalDisplayWidgetProvider implements UiItemsProvider {
  public readonly id: string = "GlobalDisplayWidgetProvider";

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Bottom) {
      widgets.push(
        {
          id: "GlobalDisplayWidget",
          label: "Global Display Controls",
          defaultState: WidgetState.Open,
          content: <GlobalDisplayWidget />,
        }
      );
    }
    return widgets;
  }
}
