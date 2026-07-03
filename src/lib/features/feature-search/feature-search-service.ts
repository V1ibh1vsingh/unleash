import type {
    IFeatureSearchStore,
    IUnleashConfig,
    IUnleashStores,
} from '../../types/index.js';
import type {
    IFeatureSearchParams,
    IQueryParam,
} from '../feature-toggle/types/feature-toggle-strategies-store-type.js';
import type { IPrivateProjectChecker } from '../private-project/privateProjectCheckerType.js';
import { parseSearchOperatorValue } from './search-utils.js';

export class FeatureSearchService {
    private featureSearchStore: IFeatureSearchStore;
    private privateProjectChecker: IPrivateProjectChecker;

    constructor(
        { featureSearchStore }: Pick<IUnleashStores, 'featureSearchStore'>,
        _config: Pick<IUnleashConfig, 'getLogger'>,
        privateProjectChecker: IPrivateProjectChecker,
    ) {
        this.featureSearchStore = featureSearchStore;
        this.privateProjectChecker = privateProjectChecker;
    }

    async search(params: IFeatureSearchParams) {
        throw new Error("STUB");
    }

    convertToQueryParams = async (
        params: IFeatureSearchParams,
    ): Promise<IQueryParam[]> => {
        throw new Error("STUB");
    };
}
