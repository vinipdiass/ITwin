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
  const [terrain, setTerrain] = useState<boolean>(true);
  /** Display map labels with the map imagery. */
  const [mapLabels, setMapLabels] = useState<boolean>(false);
  /** Display 3d building meshes from Open Street Map Buildings. */
  const [buildings, setBuildings] = useState<boolean>(true);
  /** If buildings are displayed, also display their edges. */
  const [buildingEdges, setBuildingEdges] = useState<boolean>(true);

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
          <ToggleSwitch
            label={infoLabel("Terrain", "Display 3d terrain from Cesium World Terrain Service")}
            checked={terrain}
            onChange={() => setTerrain(!terrain)}
          />
          <ToggleSwitch
            label={infoLabel("Map Labels", "Include labels in the Bing map imagery")}
            checked={mapLabels}
            onChange={() => setMapLabels(!mapLabels)}
          />
          <ToggleSwitch
            label={infoLabel("Buildings", "Display building meshes from Open Street Map")}
            checked={buildings}
            onChange={() => setBuildings(!buildings)}
          />
          <ToggleSwitch
            label={infoLabel("Building Edges", "Display the edges of the building meshes")}
            checked={buildingEdges}
            onChange={() => setBuildingEdges(!buildingEdges)}
          />
        </div>
        <div className="travel-destination">
          <Button size="small" className="travel-destination-btn" styleType="cta"
          onClick={() => {setDestination("Orla do Guaíba");
          _travelToDestination();
      }} title={"Viajar direto para a orla do Guaíba"}>Viajar para a Orla do Guaíba</Button>
        </div>
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
