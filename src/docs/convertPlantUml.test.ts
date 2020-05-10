import { encodePlainUrls } from './convertPlantUml';

describe('encodePlainUrls', () => {
  it('should work for default example', () => {
    const text = `
    @startuml
    Bob -> Alice : hello
    @enduml`;
    const urls = encodePlainUrls(text);
    expect(urls.img).toEqual(
      'https://www.plantuml.com/plantuml/img/ur800eVYaiIYajBS72uGpoa_IK7NJi4n9pCvLS5A8ICr9oSVBE6GcfS2L0G0'
    );
  });
});
