export interface AddClientFacadeInputDto {
  name: string;
  email: string;
  address: string;
}

export interface AddClientFacadeOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindClientFacadeInputDto {
  id: string;
}

export interface FindClientFacadeOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}
