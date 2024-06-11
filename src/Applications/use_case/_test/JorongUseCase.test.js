const JorongUseCase = require('../JorongUseCase');
const JorongRepository = require('../../../Domains/jorong/JorongRepository');
const NagariRepository = require('../../../Domains/nagari/NagariRepository');

describe('JorongUseCase', () => {
  describe('addJorong function', () => {
    it('should orchestrating the add jorong action correctly', async () => {
      // Arrange
      const useCasePayload = {
        name: 'Jorong Test',
        nagariId: 'nagari-123',
      };
      const expectedJorong = {
        id: 'jorong-123',
        name: 'Jorong Test',
        nagariId: 'nagari-123',
      };

      /** creating dependency of use case */
      const mockJorongRepository = new JorongRepository();
      const mockNagarirepository = new NagariRepository();

      /** mocking needed function */
      mockNagarirepository.getNagariById = jest.fn(() => Promise.resolve());
      mockJorongRepository.verifyAvailableJorongName = jest.fn(() => Promise.resolve());
      mockJorongRepository.addJorong = jest.fn(() => Promise.resolve(expectedJorong));

      /** creating use case instance */
      const getJorongUseCase = new JorongUseCase({
        jorongRepository: mockJorongRepository,
        nagariRepository: mockNagarirepository,
      });

      // Action
      const jorong = await getJorongUseCase.addJorong(useCasePayload);

      // Assert
      expect(jorong).toStrictEqual(expectedJorong);
      expect(mockJorongRepository.verifyAvailableJorongName).toBeCalledWith(useCasePayload.name);
      expect(mockJorongRepository.addJorong).toBeCalledWith(useCasePayload);
    });
  });

  describe('getJorong function', () => {
    it('should orchestrating the get jorong action correctly', async () => {
      // Arrange
      const queryParams = {
        nagariId: 'nagari-123',
      };
      const expectedJorong = [{
        id: 'jorong-123',
        name: 'Jorong Test',
        nagariId: 'nagari-123',
      }];

      /** creating dependency of use case */
      const mockJorongRepository = new JorongRepository();
      const mockNagarirepository = new NagariRepository();

      /** mocking needed function */
      mockJorongRepository.getJorong = jest.fn(() => Promise.resolve(expectedJorong));

      /** creating use case instance */
      const getJorongUseCase = new JorongUseCase({
        jorongRepository: mockJorongRepository,
        nagariRepository: mockNagarirepository,
      });

      // Action
      const jorong = await getJorongUseCase.getJorong(queryParams);

      // Assert
      expect(jorong).toStrictEqual(expectedJorong);
      expect(mockJorongRepository.getJorong).toBeCalledWith(queryParams);
    });
  });
});