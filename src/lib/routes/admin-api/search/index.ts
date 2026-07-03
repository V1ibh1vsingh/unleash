import EventSearchController from '../../../features/events/event-search-controller.js';
import FeatureSearchController from '../../../features/feature-search/feature-search-controller.js';
import type { IUnleashServices } from '../../../services/index.js';
import type { Db, IUnleashConfig } from '../../../types/index.js';
import Controller from '../../controller.js';

export class SearchApi extends Controller {
    constructor(config: IUnleashConfig, services: IUnleashServices, _db: Db) {
        throw new Error("STUB");
    }
}
