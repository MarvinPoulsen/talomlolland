// MiniMap.d.ts
declare namespace MiniMap {
    // The MiniMap object provides a namespace for instances of all MiniMap Classes

    // Classes
    class ASearchService {}
    class DatasourceSearchService {}
    class DrawingTheme {}
    class DynamicTheme {}
    class Events {
        addListener(event: string, callback: Function): MiniMap.EventListener;
    }
    class GeoSearchService {}
    class GSearchService {}
    class InfoQueryHandler {}
    class SearchHandler {}
    class Theme {}
    class ThemeGroup {}
    class UserTheme {}
    class VectorTheme {}

    // Widget
    class Widget {
        constructor(options: {
            minimapId?: string;
            profile?: string;
            mapDiv: string;
            searchDiv?: string;
            themeDiv?: string;
            infoDiv?: string;
            initCallback?: Function;
            infoOptions?: {
                hyperlinkTarget?: string;
                extraThemes?: string;
            };
        });

        searchHandler: SearchHandler;
        infoQueryHandler: InfoQueryHandler;
        getSession(): SpatialServer.Session;
        getEvents(): Events; // Added getEvents method
        getMapControl():MapControl;
    }

    // Namespaces
    namespace Gui {
        // Classes
        class BackgroundThemeToggleControl {}
        class ClickControl {}
        class CopyrightControl {}
        class LegendControl {}
        class LocationControl {}
        class MapATable {}
        class MapControl {
            constructor();

            _element: any; // the provided/created element of the control. For use in subclasses
            map: ol.Map; // The OpenLayers implementation.

            setMarkingGeometry(wkt: string | SpatialServer.Geometry | null, zoomTo?: boolean, hide?: boolean, zoomToBuffer?: number | string): void;
            setVisibility(visible: boolean): void;
            zoomToExtent(extent: Extent, zoomToBuffer?: number | string): Extent;
        }
        class SearchControl {}
        class StartExtentControl {}
        class ThemeSelectorIconControl {}
        class ThemeSelectorLegendControl {}
        class ViewList {}
        class ViewPopup {}
        class ViewSimple {}
    }

    namespace MapInteraction {}

    // Members
    const VERSION_NUMBER: number; // Express the version of the MiniMap implementation. First standard version was 2.0

    // Methods
    function createMiniMap(options: object): void; // See MiniMap.Widget constructor for options details.

    // Type Definitions
    interface StateObject {
        themes: ThemeState[]; // theme list. The order of themes in the list defines the rendering order (see MiniMap.ThemeGroup#setRenderingOrder constraints)
        themeGroups: ThemeGroupState[]; // theme group expansion state
        map: Gui.MapControl.MapState; // map viewport. The mapstate is extended with a bbox property
    }

    interface ThemeGroupStateObject {
        name: string;
        expanded: boolean;
    }

    interface ThemeStateObject {
        name: string;
        opacity: number;
        visible: boolean;
    }
}
