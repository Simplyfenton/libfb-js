import * as zlib from 'zlib'
import AuthTokens from '../../types/AuthTokens'
import DeviceId from '../../types/DeviceId'
import MqttMessage from '../MqttMessage'
import { MqttConnectFlag } from '../MqttTypes'
import * as Payloads from '../payloads'
import { MessageType } from './MessageTypes'

const USER_AGENT =
    'Facebook plugin / LIBFB-JS / [FBAN/MessengerDesktop;FBAV/215.0.0.10.211;FBDV/iMac21,1;FBSN/darwin;FBSV/14.6.1;FBSC/arm64;FBLC/en_GB;FBBV/616513476;FBSS/1;FBID/desktop;FBWS/0;MDBeta/0;MDMas/0;MDZeratul/1]'

/**
 * Assembles a connect messages sent just after a TLS connection is established.
 */
export const encodeConnectMessage = async (
    tokens: AuthTokens,
    deviceId: DeviceId
): Promise<MqttMessage> => {
  const payload = new Payloads.Connect(deviceId, tokens, USER_AGENT)
  const flags =
    MqttConnectFlag.User |
    MqttConnectFlag.Pass |
    MqttConnectFlag.Clr |
    MqttConnectFlag.QoS1
  return new MqttMessage(MessageType.Connect)
    .setFlags(MqttConnectFlag.QoS0)
    .writeString('MQTToT')
    .writeU8(3)
    .writeU8(flags)
    .writeU16(60) // KEEP ALIVE
    .writeRaw(zlib.deflateSync(await Payloads.encodePayload(payload)))
}
