import ProcessPaymentUseCase from "./process-payment.usecase";

const MockRepository = () => {
  return {
    save: jest.fn(),
  };
};

describe("Process payment usecase unit test", () => {
  it("should approve a transaction", async () => {
    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await usecase.execute(input);
    expect(paymentRepository.save).toHaveBeenCalled();

    expect(result.transactionId).toBeDefined();
    expect(result.status).toEqual("approved");
    expect(result.amount).toEqual(100);
    expect(result.orderId).toEqual("1");
  });
  it("should decline a transaction", async () => {
    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    const input = {
      orderId: "1",
      amount: 50,
    };

    const result = await usecase.execute(input);
    expect(result.transactionId).toBeDefined();
    expect(result.status).toEqual("declined");
    expect(result.amount).toEqual(50);
    expect(result.orderId).toEqual("1");
  });
});
