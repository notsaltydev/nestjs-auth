import { CrudService } from '../../base';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entity';
import { USER_TOKEN } from './user.constants';
import { passwordHash } from '../_helpers';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import {Repository} from '../_helpers/database';

@Injectable()
export class UserService extends CrudService<UserEntity> {

	constructor(@Inject(USER_TOKEN) protected readonly repository: Repository<UserEntity>) {
		super();
	}

	public async login(credentials: CredentialsDto): Promise<UserEntity> {
		const user = await this.repository.findOne({
			email: credentials.email,
			password: passwordHash(credentials.password)
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	public async socialRegister({name, email, socialId, provider}) {
		const user = new UserEntity();
		user.name = name;
		user.email = email;
		user.socialId = socialId;
		user.provider = provider;
		return this.repository.save(user);
	}
}
