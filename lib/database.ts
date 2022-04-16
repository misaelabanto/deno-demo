export type Resource<T> = { id?: string } & T;

export class Database {
  private collection: string;
	constructor(collection: string) {
    this.collection = collection;
	}
	private async getCollectionResources<T>(): Promise<Resource<T>[]> {
    const rawData = await Deno.readTextFile(this.getPath(this.collection));
		return JSON.parse(rawData) as Resource<T>[];
	}
  private async saveCollectionResources<T>(resources: Resource<T>[]): Promise<void> {
    await Deno.writeTextFile(this.getPath(this.collection), JSON.stringify(resources));
  }
	async findById<T>(id: string): Promise<Resource<T> | undefined>  {
    const resources = await this.getCollectionResources<T>();
		return resources.find(item => item.id === id);
	}
  async find<T>(finder: (item: T) => boolean = () => true) {
    const resources = await this.getCollectionResources<T>();
		return resources.filter(finder);
  }
  async insert<T>(resource: T): Promise<Resource<T>> {
    const resourceInsert: Resource<T> = resource;
    resourceInsert.id = crypto.randomUUID();
    const resources = await this.getCollectionResources<T>();
    resources.push(resourceInsert);
    this.saveCollectionResources(resources);
    return resourceInsert;
  }
	private getPath(collection: string): string {
    const cwd = Deno.cwd();
		return cwd + '/.data/' + collection + '.json';
	}
	static collection(name: string) {
		return new Database(name);
	}
}
