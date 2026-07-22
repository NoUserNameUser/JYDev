import * as migration_20260505_032344_initial_payload_schema from './20260505_032344_initial_payload_schema';
import * as migration_20260717_055227_freelancer_inquiries from './20260717_055227_freelancer_inquiries';
import * as migration_20260717_062645_gallery_showcases from './20260717_062645_gallery_showcases';
import * as migration_20260720_072426_work_showcase_redesign from './20260720_072426_work_showcase_redesign';

export const migrations = [
  {
    up: migration_20260505_032344_initial_payload_schema.up,
    down: migration_20260505_032344_initial_payload_schema.down,
    name: '20260505_032344_initial_payload_schema',
  },
  {
    up: migration_20260717_055227_freelancer_inquiries.up,
    down: migration_20260717_055227_freelancer_inquiries.down,
    name: '20260717_055227_freelancer_inquiries',
  },
  {
    up: migration_20260717_062645_gallery_showcases.up,
    down: migration_20260717_062645_gallery_showcases.down,
    name: '20260717_062645_gallery_showcases',
  },
  {
    up: migration_20260720_072426_work_showcase_redesign.up,
    down: migration_20260720_072426_work_showcase_redesign.down,
    name: '20260720_072426_work_showcase_redesign'
  },
];
