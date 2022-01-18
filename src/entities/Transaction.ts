import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";
import { BigNumber } from "ethers";
import { AccessList } from "ethers/lib/utils";

@Entity()
export class Transaction {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column()
  hash: string;
  @Column()
  blockNumber?: number | undefined;
  @Column()
  blockHash?: string | undefined;
  @Column()
  timestamp?: number | undefined;
  @Column()
  confirmations: number;
  @Column()
  from: string;
  @Column()
  raw?: string | undefined;
  @Column()
  to?: string | undefined;
  @Column()
  nonce: number;
  @Column()
  gasLimit: BigNumber;
  @Column()
  gasPrice?: BigNumber | undefined;
  @Column()
  data: string;
  @Column()
  value: BigNumber;
  @Column()
  chainId: number;
  @Column()
  r?: string | undefined;
  @Column()
  s?: string | undefined;
  @Column()
  v?: number | undefined;
  @Column()
  type?: number | null | undefined;
  @Column()
  accessList?: AccessList | undefined;
  @Column()
  maxPriorityFeePerGas?: BigNumber | undefined;
  @Column()
  maxFeePerGas?: BigNumber | undefined;

  constructor(tx: any) {
    this._id = new ObjectId();
    this.hash = tx?.hash;
    this.blockNumber = tx?.blockNumber;
    this.blockHash = tx?.blockHash;
    this.timestamp = tx?.timestamp;
    this.confirmations = tx?.confirmations;
    this.from = tx?.from;
    this.raw = tx?.raw;
    this.to = tx?.to;
    this.nonce = tx?.nonce;
    this.gasLimit = tx?.gasLimit;
    this.gasPrice = tx?.gasPrice;
    this.data = tx?.data;
    this.value = tx?.value;
    this.chainId = tx?.chainId;
    this.r = tx?.r;
    this.s = tx?.s;
    this.v = tx?.v;
    this.type = tx?.type;
    this.accessList = tx?.accessList;
    this.maxPriorityFeePerGas = tx?.maxPriorityFeePerGas;
    this.maxFeePerGas = tx?.maxFeePerGas;
  }
}
