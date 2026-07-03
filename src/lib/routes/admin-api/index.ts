import Controller from '../controller.js';
import type { IUnleashConfig, IUnleashStores } from '../../types/index.js';
import FeatureController from '../../features/feature-toggle/legacy/feature-toggle-legacy-controller.js';
import { FeatureTypeController } from './feature-type.js';
import ArchiveController from '../../features/feature-toggle/archive-feature-toggle-controller.js';
import StrategyController from './strategy.js';
import EventController from './event.js';
import PlaygroundController from '../../features/playground/playground.js';
import MetricsController from './metrics.js';
import UserController from './user/user.js';
import UiConfigController from '../../ui-config/ui-config-controller.js';
import { ContextController } from '../../features/context/context.js';
import ClientMetricsController from '../../features/metrics/client-metrics/client-metrics.js';
import TagController from './tag.js';
import TagTypeController from '../../features/tag-type/tag-type.js';
import AddonController from './addon.js';
import { ApiTokenController } from './api-token.js';
import UserAdminController from './user-admin.js';
import EmailController from './email.js';
import UserFeedbackController from './user-feedback.js';
import UserSplashController from './user-splash.js';
import ProjectController from '../../features/project/project-controller.js';
import { EnvironmentsController } from '../../features/environments/environments-controller.js';
import ConstraintsController from '../../features/constraints/constraints-controller.js';
import PatController from './user/pat.js';
import { PublicSignupController } from './public-signup.js';
import InstanceAdminController from './instance-admin.js';
import TelemetryController from './telemetry.js';
import FavoritesController from './favorites.js';
import MaintenanceController from '../../features/maintenance/maintenance-controller.js';
import type { Db } from '../../db/db.js';
import ExportImportController from '../../features/export-import-toggles/export-import-controller.js';
import { SegmentsController } from '../../features/segment/segment-controller.js';
import { InactiveUsersController } from '../../users/inactive/inactive-users-controller.js';
import { UiObservabilityController } from '../../features/ui-observability-controller/ui-observability-controller.js';
import { SearchApi } from './search/index.js';
import PersonalDashboardController from '../../features/personal-dashboard/personal-dashboard-controller.js';
import FeatureLifecycleCountController from '../../features/feature-lifecycle/feature-lifecycle-count-controller.js';
import type { IUnleashServices } from '../../services/index.js';
import CustomMetricsController from '../../features/metrics/custom/custom-metrics-controller.js';

export class AdminApi extends Controller {
    constructor(
        config: IUnleashConfig,
        services: IUnleashServices,
        stores: IUnleashStores,
        db: Db,
    ) {
        throw new Error("STUB");
    }
}
