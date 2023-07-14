import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositorys/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate-usecase'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { GerProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GerProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GerProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existin-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
