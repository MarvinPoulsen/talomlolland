declare namespace SpatialServer {
    class Principal {
        id: string;
        name: string;
        shortid: string;
        isanonymous: boolean;
        hasPermission: (permission: string) => boolean;
        getTicket: () => string;
    }

    class Page {
        call: (unknown: null, callback: (resp: any) => void) => void;
    }

    interface DatasourceRow {
        [key: string]: any;
    }

    type DSResponse<T extends DatasourceRow> = T[];

    interface ExecutionParams {
        command?: string;
        outputformat?: 'json';
        jsonFormat?: 'compact';
        filterWithWkt?: boolean;
        wkt?: boolean;
        buffer?: boolean;
        [key: string]: any;
    }

    type ResultType = 'ROWS' | 'FEATURES';

    class Datasource {
        execute: (params: ExecutionParams, callback: (data: DSResponse) => void, resultType?: ResultType) => void;
    }

    class Session {
        asyncInit: (callback: () => void) => void;
        getPrincipal: () => Principal;
        createPageRequest: (page: string) => Page;
        getDatasource: (name: string) => Datasource;
        getString: (name: string, ...params: string[]) => string;
        getParam: (name: string) => string;
        getSfs: (
            sfsOpts: { ticket: string },
            readyHandler: (sfs: Sfs) => void,
            errorHandler: (err: any) => void
        ) => SpatialServer.Sfs;
    }

    class Sfs {
        addAttachment: (
            featureType: string,
            id: string,
            name: string,
            description: string,
            data: File
        ) => Promise<{ id: number }>;
        deleteAttachment: (featureType: string, id: string, attachmentId: string) => Promise<void>;
        getAttachmentList: (featureType: string, id: string) => Promise<string[]>;
        getAttachment: (featureType: string, id: string, attachmentId: string) => Promise<string>;
    }
}
