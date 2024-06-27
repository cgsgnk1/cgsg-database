import React, { useRef, useMemo, useState, useEffect, MouseEvent } from "react";
import { DefaultMenu, ReturnToPageUI } from "../default/default-ui";
import Map, {Marker, Source} from "../../node_modules/react-map-gl/dist/es5/exports-maplibre";
import maplibregl, { MapLibreEvent } from "maplibre-gl";
import type { HeatmapLayer } from "react-map-gl";

import type { MapRef } from "../../node_modules/react-map-gl/dist/es5/exports-maplibre";
import { createRoot } from "react-dom/client";
import { IDynamic } from "../../server/server";
import { Layer } from "../../node_modules/react-map-gl/dist/es5/exports-maplibre";

let globalDraggableMarker: maplibregl.Marker | undefined = undefined;

let globalMarkers: maplibregl.Marker[] = [];

export interface IMyMarkerProps {
  lon: number;
  lat: number;
  color: string;
  textOfPopup: string;
}

function markersShowSwitch() {
  for (const marker of globalMarkers) {
    if (!marker.getElement().style.visibility) {
      marker.getElement().style.visibility = "hidden";
    } else if (marker.getElement().style.visibility == "visible") {
      marker.getElement().style.visibility = "hidden";
    } else {
      marker.getElement().style.visibility = "visible";
    }
  }
}

/*
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
*/

/*
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
*/

function clampLon(lon: number): number {
  let clamped = lon;

  while (Math.abs(clamped) > 180)
    clamped += 360 * Math.sign(-lon);

  return clamped;
}

export function MapPageUI() {
  /*
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

        const geojson = createGeoJSON(data.array);
        console.log(geojson);

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
                    height: window.innerHeight}}
            //mapStyle="https://demotiles.maplibre.org/style.json"
            // mapStyle="https://api.maptiler.com/maps/satellite/style.json?key=PJQMm1QMNMIArTURauzn"//"https://api.maptiler.com/maps/streets/style.json?OpIi9ZULNHzrESv6T2vL"
            mapStyle="https://api.maptiler.com/maps/outdoor-v2/style.json?key=PJQMm1QMNMIArTURauzn"
          >
            <Source
              type="geojson"
              data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson">
            </Source>
            {array}
          </Map>
        );
      }
    }
    func();
  });
  */

  const locationInputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  maplibreMapNonReact();

  return (
    <div>
      <DefaultMenu checked="Map"></DefaultMenu>
      <div
        style={{position: "absolute",
          top: "48px",
          left: "0px"}}
      >
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
            if (globalDraggableMarker && selectRef.current) {
              try {
                const place = JSON.parse(selectRef.current.value);
                globalDraggableMarker.setLngLat([place.lon, place.lat]);
  
                const res = await fetch("/default/map/updatePosition", {
                  method: "POST",
                  body: JSON.stringify({lat: place.lat, lon: place.lon}),
                  headers: {"Content-Type": "application/json"},
                });
                const data = await res.json();
  
                console.log(data);
              } catch (err) {
                console.log(err);
              }
            }
          }}
        >
        </select>
        <input ref={checkboxRef} className="accountCheckbox" type="checkbox"
          style={{height: "30px", fontSize: "20px", position: "absolute", top: "84px", left: "0px"}}
          onChange={() => {
              if (checkboxRef.current) {
                // checkboxRef.current.checked = !checkboxRef.current.checked;
              }
            }
          }
          
          onClick={() => {
            markersShowSwitch();
          }}
        />
        <div className="CMUDiv">
          <a style={{width: "170px", color: "black", backgroundColor: "#EEEEEE", position: "absolute", top: "84px", left: "50px", zIndex: 100001}}>Show markers</a>
        </div>
      </div>
    </div>
  );
}

function maplibreMapNonReact() {
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

  const map = new maplibregl.Map({
    container: "myMap",
    style: "https://api.maptiler.com/maps/outdoor-v2/style.json?key=PJQMm1QMNMIArTURauzn",
    center: [Number(lon), Number(lat)],
    zoom: Number(zoom),
  });

  const onMouseMoveHandle = (event: maplibregl.MapLayerMouseEvent) => {
    const center = map.getCenter();

    let lon = clampLon(center.lng);
    let lat = center.lat;

    window.localStorage.setItem("lon", lon.toString());
    window.localStorage.setItem("lat", lat.toString());
  }

  const onZoomHandle = () => {
    window.localStorage.setItem("zoom",  map.getZoom().toString());
  }

  const createGeoJSON = (markerData: any) => {
    const data: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features:
        markerData.map((marker: IMyMarkerProps) => {
          const feature: GeoJSON.Feature = {
            type: "Feature", 
            geometry: { "type": "Point", "coordinates": [marker.lon, marker.lat]},
            properties: {},
          }

          return feature;
        }),
    };

    const data2: GeoJSON.Feature = {
      type: "Feature",
      geometry: { "type": "Point", "coordinates": [markerData[0].lon, markerData[0].lat]},
      properties: {},
    };

    return data;
  }
  
  map.on("load", async () => {
    const res = await fetch("/default/map/get", {method: "POST"});
    const data = await res.json();

    if (res.status == 200) {
      for (const marker of data.array) {
        let draggable: boolean = false;
        let onDragEndHandle: any = () => {};

        if (marker.color == "blue") {
          draggable = true;
          onDragEndHandle = async (event: any) => {
            let draggableLon = event.target._lngLat.lng;
            let draggableLat = event.target._lngLat.lat;
      
            const res = await fetch("/default/map/updatePosition", {
              method: "POST",
              body: JSON.stringify({lat: draggableLat, lon: draggableLon}),
              headers: {"Content-Type": "application/json"},
            });
            const data = await res.json();
      
            console.log(data);
          };
        }

        const popup = new maplibregl.Popup().setHTML(marker.textOfPopup);

        const m = new maplibregl.Marker({
          color: marker.color,
          draggable: draggable,
        });

        if (marker.color == "blue") {
          globalDraggableMarker = m;
        } else {
          globalMarkers.push(m);
        }

        m.setLngLat([marker.lon, marker.lat]);
        m.setPopup(popup);
        m.on("dragend", (event) => {
          onDragEndHandle(event);
        })
        m.addTo(map);
      }

      // Heatmap create
      const geojson = createGeoJSON(data.array);

      // console.log(geojson);

      map.addSource("graduates", {
        type: "geojson",
        data: geojson,/*{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -157.855676,
              21.304547
            ]
          }
        }*/
      });

      map.addLayer({
        'id': 'graduates-heat',
        'type': 'heatmap',
        'source': 'graduates',
        'maxzoom': 24,
        'paint': {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            6,
            1
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            9,
            3
          ], // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparency color
          // to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(131,77,24,0)',
            0.2,
            'rgb(64,64,64)',
            0.4,
            'rgb(48,48,48)',
            0.6,
            'rgb(181,120,67)',
            0.8,
            'rgb(141,87,34)',
            1,
            'rgb(131,77,24)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            4,
            9,
            36
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            9,
            0
          ]
        }
      });
    }

    markersShowSwitch();
  });

  map.on("mousemove", (event) => {
    onMouseMoveHandle(event);
  });

  map.on("zoom", () => {
    onZoomHandle();
  });
}