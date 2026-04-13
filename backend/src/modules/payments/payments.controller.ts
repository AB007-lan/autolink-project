import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService, InitiatePaymentDto } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initier un paiement' })
  initiatePayment(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiatePayment(userId, dto);
  }

  @Post('confirm')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmer un paiement' })
  confirmPayment(@Body() body: { orderId: string; transactionRef: string }) {
    return this.paymentsService.confirmPayment(body.orderId, body.transactionRef);
  }

  @Public()
  @Post('webhook/:provider')
  @ApiOperation({ summary: 'Webhook de confirmation de paiement' })
  handleWebhook(@Param('provider') provider: string, @Body() payload: any) {
    return this.paymentsService.handleWebhook(provider, payload);
  }
}
