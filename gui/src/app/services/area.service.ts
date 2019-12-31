import {Injectable} from '@angular/core';
import {Vector as VectorSource} from "ol/source";
import Feature from 'ol/Feature';
import * as geom from 'ol/geom';
import * as olProj from 'ol/proj';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private static MAX_LEVEL:number = 3;
  constructor() {
  }

  generateAreaGrid(sketch: any, source: VectorSource) {

    let coordinates = sketch.getGeometry().getCoordinates();
    let coordinatesArray = coordinates[0];

    if (coordinatesArray.length != 5) {
      console.error('not enough points inside polygon (should be 5)');
      return;
    }

    this.insertPointMarker(coordinatesArray[0], source);
    this.insertPointMarker(coordinatesArray[1], source);
    this.insertPointMarker(coordinatesArray[2], source);
    this.insertPointMarker(coordinatesArray[3], source);

    let polygonArray = this.generateFourInternalPolygons(coordinatesArray,0);

    console.log(polygonArray);

    this.insertPolygonsAsFeatures(polygonArray, source, 0);
  }

  private insertPolygonsAsFeatures(polygonArray, source: VectorSource, level:number) {

    level += 1;

    for (let polygonData of polygonArray) {

      if (polygonData instanceof Array) {
        this.insertPolygonsAsFeatures(polygonData, source, level);
      } else {
        let polygonBoxFeature = new Feature({
          geometry: polygonData
        });

        if (level == AreaService.MAX_LEVEL) {
          source.addFeature(polygonBoxFeature);
        }
      }
    }
  }

  private generateFourInternalPolygons(coordinatesArray, level:number) {
    level += 1;
    let polygonArray = [];

    let one = coordinatesArray[0];
    let five = coordinatesArray[1];
    let seven = coordinatesArray[2];
    let nine = coordinatesArray[3];
    let two = this.getMiddlePoint(one, five);
    let three = this.getMiddlePoint(two, this.getMiddlePoint(seven, nine));
    let four = this.getMiddlePoint(nine, one);
    let six = this.getMiddlePoint(five, seven);
    let eight = this.getMiddlePoint(nine, seven);

    polygonArray.push(this.createBox(one, two, three, four));
    polygonArray.push(this.createBox(two, five, six, three));
    polygonArray.push(this.createBox(six, seven, eight, three));
    polygonArray.push(this.createBox(three, eight, nine, four));

    if (level < AreaService.MAX_LEVEL) {
      polygonArray.push(this.generateFourInternalPolygons(polygonArray[0].getCoordinates()[0],level));
      polygonArray.push(this.generateFourInternalPolygons(polygonArray[1].getCoordinates()[0],level));
      polygonArray.push(this.generateFourInternalPolygons(polygonArray[2].getCoordinates()[0],level));
      polygonArray.push(this.generateFourInternalPolygons(polygonArray[3].getCoordinates()[0],level));
    }

    return polygonArray;
  }

  /**
   * Returns the middle point between two points
   * @param first
   * @param second
   */
  private getMiddlePoint(first, second): any {

    let middleBottomPoint = [
      first[0] + (second[0] - first[0]) / 2,
      first[1] + (second[1] - first[1]) / 2
    ];

    return middleBottomPoint;
  }

  private insertPointMarker(pointCoordinates: any, source: VectorSource):any {
    let point = new geom.Point(olProj.fromLonLat([pointCoordinates[0], pointCoordinates[1]], 'EPSG:4326', 'EPSG:3857'));
    let g = new Feature({
      geometry: point
    });
    source.addFeature(g);
    return pointCoordinates;
  }

  private createBox(a,b,c,d):geom.Polygon {

    let points = [];
    points.push(a);
    points.push(b);
    points.push(c);
    points.push(d);
    points.push(a);
    let polygon = new geom.Polygon([points]);
    let srcProj = new olProj.Projection("EPSG:4326");
    let targetProj = new olProj.Projection("EPSG:3857");
    polygon.transform(srcProj, targetProj);

    return polygon;
  }
}
