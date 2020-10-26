import { makeEmailDomain } from '@mn-be/domain/email'
// import { makeWorkers } from '@mn-be/domain/email/mock'
import { makeWorkers } from '@mn-be/domain/email/mailgun'
import { EmailDomain } from '@mn-be/domain/email/EmailDomainTypes'
import { domainTransport, inProcess } from '@mn-be/domainTransport'
import { bindApis } from '@mn-be/domainTransport/inProcess'
import { makeTestDomain } from '@mn-be/domain/_test'
import { TestDomain } from '@mn-be/domain/_test/TestDomainTypes'

export const { transport, emitter } = inProcess.make({}, { logger: console.log })

export const emailDomainWorkers = makeWorkers(
  {
    mailgunCfg: {
      apiKey: 'key-fef7986b0ee2452f1a86293a0589f877',
      domain: 'sandboxe9cad373d8594e63be8dbdc016c3f3e6.mailgun.org',
    },
  },
  {}
)
export const emailDomainTransport = domainTransport<EmailDomain>({
  domain: 'Email',
  msgT: transport,
})
export const emailDomain = makeEmailDomain({
  workers: emailDomainWorkers,
  trnsp: emailDomainTransport,
})
bindApis<EmailDomain>('Email', emailDomain, transport, emitter)

export const _testDomainTransport = domainTransport<TestDomain>({
  domain: 'Test',
  msgT: transport,
})
export const _testDomain = makeTestDomain({
  trnsp: _testDomainTransport,
})
bindApis<TestDomain>('Test', _testDomain, _testDomainTransport, emitter)