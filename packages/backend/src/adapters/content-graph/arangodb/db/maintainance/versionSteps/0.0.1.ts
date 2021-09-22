import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createDBCollections } from './0.0.1/createDBCollections'
import { createFileFormats } from './0.0.1/createFileFormats'
import { createIscedFields } from './0.0.1/createIscedFields'
import { createIscedGrades } from './0.0.1/createIscedGrades'
import { createLanguges } from './0.0.1/createLanguages'
import { createLicenses } from './0.0.1/createLicenses'
import { createLocalOrg } from './0.0.1/createLocalOrg'
import { createResourceTypes } from './0.0.1/createResourceTypes'
import { createRootUserProfile } from './0.0.1/createRootUserProfile'
import { setupSearchView } from './0.0.1/setupSearchView'

const init_0_0_1: VersionUpdater<MNStaticEnv> = {
  async initialSetUp({ db, ctx: { domain } }) {
    await createDBCollections({ db })
    await createRootUserProfile({ db })
    await createLocalOrg({ db, domain })
    await createIscedFields({ db })
    await createIscedGrades({ db })
    await createFileFormats({ db })
    await createResourceTypes({ db })
    await createLicenses({ db })
    await createLanguges({ db })

    await setupSearchView({ db })
  },
}

module.exports = init_0_0_1