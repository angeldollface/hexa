/*
HEXA by Alexander Abraham, a.k.a. "Angel Dollface".
Licensed under the MIT license.
*/

// Importing React to define our
// component.
import React from 'react';

// Importing types for Typescript.
import { ReactElement } from 'react'

// Importing our render function.
import { renderModel } from './render';

// Defining our class-based component.
export class ModelCog extends React.Component {

    // Empty rendering function 
    //since "renderModel" does everything.
    render(): ReactElement {
        return (
          <>
          </>			
        );
    }

    // Only using "renderModel"
    // after the virtual DOM
    // is synced up.
    componentDidMount(): void {
        let symbolName: string = 'Moon';
        let modelURL: string = 'https://angeldollface.art/doll-cdn/models/MoonGlowing.glb';
        renderModel(
            modelURL,
            symbolName
        );
    }
}

export default ModelCog;
