import React, { useRef, useMemo, useState, useEffect } from "react";
import { DefaultMenu, ReturnToPageUI } from "../default/default-ui";
import Map, {Marker} from "../../node_modules/react-map-gl/dist/es5/exports-maplibre";
import maplibregl from "maplibre-gl";

import type { MapRef } from "../../node_modules/react-map-gl/dist/es5/exports-maplibre";
import { createRoot } from "react-dom/client";

export interface IMyMarkerProps {
  lon: number;
  lat: number;
  color: string;
  textOfPopup: string;
}

export function MyMarker(props: IMyMarkerProps) {
  const markerRef = useRef<maplibregl.Marker>(null);

  const onPopup = useMemo(() => {
    const pp = new maplibregl.Popup();
    pp.setHTML(`<div>${props.textOfPopup}</div>`);
    return pp;
  }, []);

  return (
    <div>
      <Marker longitude={props.lon} latitude={props.lat} color={props.color} draggable={false} popup={onPopup} ref={markerRef}/>
    </div>
  )
}

export function MyDraggableMarker(props: IMyMarkerProps) {
  const markerRef = useRef<maplibregl.Marker>(null);

  const onPopup = useMemo(() => {
    const pp = new maplibregl.Popup();
    pp.setHTML(`<div>${props.textOfPopup}</div>`);
    return pp;
  }, []);

  const onDragEndHandle =
    async (event: any) => {
      let draggableLon = event.lngLat.lng;
      let draggableLat = event.lngLat.lat;

      const res = await fetch("/default/map/updatePosition", {
        method: "POST",
        body: JSON.stringify({lat: draggableLat, lon: draggableLon}),
        headers: {"Content-Type": "application/json"},
      });
      const data = await res.json();

      console.log(data);
  };

  const locationInputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div>
      <Marker onDragEnd={onDragEndHandle} longitude={props.lon} latitude={props.lat} color={props.color} draggable={true} popup={onPopup} ref={markerRef}/>
      <div>
        <input ref={locationInputRef} type="text" className="signInput" style={{zIndex: 100001, position: "absolute", top: "6px"}}/>
        <input type="button" className="indexButton" value="Search location"
          style={{zIndex: 100001, position: "absolute", top: "6px", left: "360px"}}
          onClick={async () => {
            if (locationInputRef.current && selectRef.current) {
              if (locationInputRef.current.value == "") {
                selectRef.current.innerHTML = "";
              } else {
                const res = await fetch("/default/map/getLatLon", {
                  method: "POST",
                  body: JSON.stringify({place: locationInputRef.current.value}),
                  headers: {"Content-Type": "application/json"},
                });
                const data = await res.json();
  
                if (res.status == 200) {
                  selectRef.current.innerHTML = "";
                  const option = new Option("Select one of places found by Geoapify...");
                  selectRef.current.options.add(option);

                  for (const place of data.array) {
                    const option = new Option(JSON.stringify(place));
                    selectRef.current.options.add(option);
                  }
                }
              }
            }
          }}
        />
        <select ref={selectRef} className="signSelect" style={{maxWidth: "500px", position: "absolute", top: "6px", left: "600px", zIndex: 100001}}
          onChange={async () => {
            if (markerRef.current && selectRef.current) {
              try {
                const place = JSON.parse(selectRef.current.value);
                markerRef.current.setLngLat([place.lon, place.lat]);
  
                const res = await fetch("/default/map/updatePosition", {
                  method: "POST",
                  body: JSON.stringify({lat: place.lat, lon: place.lon}),
                  headers: {"Content-Type": "application/json"},
                });
                const data = await res.json();
  
                console.log(data);
              } catch (err) {
              }
            }
          }}
        >
        </select>
      </div>
    </div>
  );
}

function clampLon(lon: number): number {
  let clamped = lon;

  while (Math.abs(clamped) > 180)
    clamped += 360 * Math.sign(-lon);

  return clamped;
}

export interface IMapPageUIProps {
  markers: React.JSX.Element[];
}

export function MapPageUI() {
  const mapRef = useRef<MapRef>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);

  const onMouseMoveHandle = (event: maplibregl.MapLayerMouseEvent) => {
    if (!mapRef.current) {
      return;
    }

    const center = mapRef.current.getCenter();

    let lon = clampLon(center.lng);
    let lat = center.lat;

    window.localStorage.setItem("lon", lon.toString());
    window.localStorage.setItem("lat", lat.toString());
  }

  const onZoomHandle = (event: any) => {
    window.localStorage.setItem("zoom", event.viewState.zoom.toString());
  }

  useEffect(() => {
    const func = async () => {
      if (!mapDivRef.current) {
        return;
      }

      let lon = window.localStorage.getItem("lon");
      if (!lon) {
        lon = "30.347";
      }
    
      let lat = window.localStorage.getItem("lat");
      if (!lat) {
        lat = "59.947";
      }
    
      let zoom = window.localStorage.getItem("zoom");
      if (!zoom) {
        zoom = "10.67";
      }

      const res = await fetch("/default/map/get", {method: "POST"});
      const data = await res.json();

      if (res.status == 200) {
        const array = data.array.map((marker: IMyMarkerProps) => {
          if (marker.color == "blue") {
            return (
              <div key={marker.textOfPopup}>
                <MyDraggableMarker
                  lat={marker.lat}
                  lon={marker.lon}
                  color={marker.color}
                  textOfPopup={marker.textOfPopup}
                >
                </MyDraggableMarker>
              </div>
            )
          } else {
            return (
              <div key={marker.textOfPopup}>
                <MyMarker
                  lat={marker.lat}
                  lon={marker.lon}
                  color={marker.color}
                  textOfPopup={marker.textOfPopup}
                >
                </MyMarker>
              </div>
            )
          }
        });

        const root = createRoot(mapDivRef.current);
  
        root.render(
          <Map
            ref={mapRef}
            onMouseMove={onMouseMoveHandle}
            onZoom={onZoomHandle}
            id="map"
            initialViewState={{longitude: Number(lon), latitude: Number(lat), zoom: Number(zoom)}}
            style={{position: "absolute",
                    top: "48px",
                    left: "0px",
                    margin: `0px 0px 0px 0px`,
                    width:  window.innerWidth,//window.innerWidth * 3 / 8,
                    height: window.innerHeight/*</div>window.innerHeight / 2*/}}
            //mapStyle="https://demotiles.maplibre.org/style.json"
            // mapStyle="https://api.maptiler.com/maps/satellite/style.json?key=PJQMm1QMNMIArTURauzn"//"https://api.maptiler.com/maps/streets/style.json?OpIi9ZULNHzrESv6T2vL"
            mapStyle="https://api.maptiler.com/maps/outdoor-v2/style.json?key=PJQMm1QMNMIArTURauzn"
          >
            {array}
          </Map>
        );
      }
    }
    func();
  });

  return (
    <div>
      <DefaultMenu checked="Map"></DefaultMenu>
      <div ref={mapDivRef}></div>
    </div>
  );
}
