import { writeHeapSnapshot } from 'v8';
import { tmpdir } from 'os';
import { join } from 'path';
import { register as prometheusRegister } from 'prom-client';
import { impactRegister } from '../features/metrics/impact/impact-register.js';
import Controller from './controller.js';
import type { IUnleashConfig } from '../types/option.js';
import type { IFlagResolver } from '../types/index.js';
import type { CustomMetricsService } from '../features/metrics/custom/custom-metrics-service.js';
import type { IUnleashServices } from '../services/index.js';

class BackstageController extends Controller {
    logger: any;
    private flagResolver: IFlagResolver;
    private customMetricsService: CustomMetricsService;

    constructor(
        config: IUnleashConfig,
        {
            customMetricsService,
        }: Pick<IUnleashServices, 'customMetricsService'>,
    ) {
        throw new Error("STUB");
    }
}

export { BackstageController };
