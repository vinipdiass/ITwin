/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { MapLayerOptions, TileAdmin } from "@itwin/core-frontend";

// Sandbox provides map key values at runtime, however it's required to create your own account at map providers and
// get appropriate access tokens for your own projects (or exported Sandbox)
export const mapLayerOptions: MapLayerOptions = {
  // Api key for Bing Maps service. For more information https://www.microsoft.com/en-us/maps/create-a-bing-maps-key
  BingMaps: {
    key: "key",
    value: process.env.IMJS_BING_MAPS_KEY || "AsfmhmQrJz0seX2eU4-BXHTIXo2vzmb2PhuZ5oKvTq7_9edCMtVL9v-4Ev9aLCrU",
  },

  // Access token for Map Box service. For more information: https://docs.mapbox.com/help/getting-started/access-tokens
  MapboxImagery: {
    key: "access_token",
    value: process.env.IMJS_MAP_BOX_KEY || "sk.eyJ1IjoidmluaXBkaWFzIiwiYSI6ImNsbW96bGg5dTA3NWgycnAzcm1wdW83NHAifQ.4FIPW33rFNJfgXsSCgqlRw",
  },
};

// Access token for Cesium service. For more information: https://cesium.com/learn/ion/cesium-ion-access-tokens
export const tileAdminOptions: TileAdmin.Props = {
  cesiumIonKey: process.env.IMJS_CESIUM_ION_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkN2VhMmUxYy1lZDQyLTQ2MjUtODFiOS02MWZhNmE5MzMyYjUiLCJpZCI6MTY2OTU1LCJpYXQiOjE2OTUwNDc0NTV9.LekfL3oUKk3i-i6niy877rIPKgboPMsumIB3SVQhB5c"
};
