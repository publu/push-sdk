import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import { groupDtoToSpaceDto } from './../chat/helpers';
import { createGroup } from '../chat/createGroup';

export interface ChatCreateSpaceType extends EnvOptionsType {
  signer: SignerType;
  spaceName: string;
  spaceDescription: string;
  members: Array<string>;
  spaceImage: string | null;
  admins: Array<string>;
  isPublic: boolean;
  contractAddressNFT?: string;
  numberOfNFTs?: number;
  contractAddressERC20?: string;
  numberOfERC20?: number;
  pgpPrivateKey?: string;
  meta?: string;
  scheduleAt: Date;
  scheduleEnd?: Date | null;
}

export async function create(options: ChatCreateSpaceType): Promise<SpaceDTO> {
  const {
    signer,
    spaceName,
    spaceDescription,
    members,
    spaceImage,
    admins,
    isPublic,
    contractAddressNFT,
    numberOfNFTs,
    contractAddressERC20,
    numberOfERC20,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    meta,
    scheduleAt,
    scheduleEnd,
  } = options || {};

  try {
    const group = await createGroup({
      signer,
      groupName: spaceName,
      groupDescription: spaceDescription,
      members: members,
      groupImage: spaceImage,
      admins: admins,
      isPublic: isPublic,
      contractAddressNFT: contractAddressNFT,
      numberOfNFTs: numberOfNFTs,
      contractAddressERC20: contractAddressERC20,
      numberOfERC20: numberOfERC20,
      env,
      pgpPrivateKey,
      meta: meta,
      groupType: 'spaces',
      scheduleAt: scheduleAt,
      scheduleEnd: scheduleEnd,
    });

    return groupDtoToSpaceDto(group);
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${create.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${create.name} -: ${err}`);
  }
}