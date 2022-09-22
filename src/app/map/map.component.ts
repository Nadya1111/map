import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {DivIcon, divIcon, LatLng, latLng, Marker, marker, Polyline, tileLayer, Map} from "leaflet";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {


  @ViewChild('map')
  private mapContainer: ElementRef<Map> | undefined;

  public options;
  public form: FormGroup;
  public centerMap: LatLng;
  public markers: Marker[];
  public svgIcon: DivIcon;
  public polyline: Polyline;

  constructor() {
    const initPolyLines: LatLng[] = [];
    this.polyline = new Polyline(initPolyLines, {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });
    this.svgIcon = divIcon({
      html: `<svg class=\"svg-icon\" style=\"width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M512 853.333333a341.333333 341.333333 0 0 1-341.333333-341.333333 341.333333 341.333333 0 0 1 341.333333-341.333333 341.333333 341.333333 0 0 1 341.333333 341.333333 341.333333 341.333333 0 0 1-341.333333 341.333333m0-768A426.666667 426.666667 0 0 0 85.333333 512a426.666667 426.666667 0 0 0 426.666667 426.666667 426.666667 426.666667 0 0 0 426.666667-426.666667A426.666667 426.666667 0 0 0 512 85.333333m0 448a64 64 0 0 1-64-64A64 64 0 0 1 512 405.333333a64 64 0 0 1 64 64 64 64 0 0 1-64 64m0-226.133333c-89.6 0-162.133333 72.533333-162.133333 162.133333 0 128 162.133333 277.333333 162.133333 277.333334s162.133333-149.333333 162.133333-277.333334c0-89.6-72.533333-162.133333-162.133333-162.133333z\" fill=\"\" /></svg>`,
      className: "",
      iconSize: [24, 40],
      iconAnchor: [12, 40],
    });
    this.markers = [];
    this.centerMap = new LatLng(0, 0)
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
      ],
      zoom: 13,
      center: latLng(0, 0)
    };
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl('')
    });
  }

  ngAfterViewInit(): void {
    this.getUserLocation();
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.centerMap = new LatLng(position.coords.latitude, position.coords.longitude)
      });
    } else {
      console.log("User not allow")
    }
  }

  public onCreateMarker(): void {
    if (!this.form.value.name || !this.form.value.lat || !this.form.value.lng) {
      alert("Заполните, пожалуйста, все поля");
      return;
    }
    this.centerMap = new LatLng(this.form.value.lat, this.form.value.lng);
    this.markers.push(marker([this.form.value.lat, this.form.value.lng],
      {
        title: `${this.form.value.name}, Координаты: ${this.form.value.lat}, ${this.form.value.lng} `,
        icon: this.svgIcon
      })
    );
    this.polyline.addLatLng(latLng(this.form.value.lat, this.form.value.lng));
  }
}
