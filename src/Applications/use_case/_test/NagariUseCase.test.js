const ShowNagari = require('../../../Domains/nagari/entities/ShowNagari');
const NagariUseCase = require('../NagariUseCase');
const CreateNagari = require('../../../Domains/nagari/entities/CreateNagari');
const NagariRepository = require('../../../Domains/nagari/NagariRepository');

describe('NagariUseCase', () => {
  describe('addNagari function', () => {
    it('should orchestrating the add nagari action correctly', async () => {
      // Arrange
      const useCasePayload = {
        name: 'Nagari Test',
      };

      const mockCreatedNagari = new ShowNagari({
        id: 'nagari-123',
        name: useCasePayload.name,
      });

      // creating dependency of use case
      const mockNagariRepository = new NagariRepository();

      // mocking needed function
      mockNagariRepository.verifyAvailableNagariName = jest.fn(() => Promise.resolve());
      mockNagariRepository.addNagari = jest.fn(() => Promise.resolve(mockCreatedNagari));

      // creating use case instance
      const nagariUseCase = new NagariUseCase({
        nagariRepository: mockNagariRepository,
      });

      // Action
      const createdNagari = await nagariUseCase.addNagari(useCasePayload);

      // Assert
      expect(createdNagari).toStrictEqual(mockCreatedNagari);
      expect(mockNagariRepository.verifyAvailableNagariName).toBeCalledWith(useCasePayload.name);
      expect(mockNagariRepository.addNagari).toBeCalledWith(new CreateNagari({
        name: useCasePayload.name,
      }));
    });
  });

  describe('showNagari function', () => {
    it('should orchestrating the show nagari action correctly', async () => {
      // Arrange
      const useCasePayload = {
        search: 'Nagari Test',
      };

      const mockNagari = new ShowNagari({
        id: 'nagari-123',
        name: useCasePayload.search,
      });

      // creating dependency of use case
      const mockNagariRepository = new NagariRepository();

      // mocking needed function
      mockNagariRepository.getNagari = jest.fn(() => Promise.resolve({ data: [mockNagari] }));

      // creating use case instance
      const nagariUseCase = new NagariUseCase({
        nagariRepository: mockNagariRepository,
      });

      // Action
      const nagari = await nagariUseCase.showNagari(useCasePayload);

      // Assert
      expect(nagari).toStrictEqual({ data: [mockNagari]});
      expect(mockNagariRepository.getNagari).toBeCalledWith(useCasePayload);
    });
  });
});