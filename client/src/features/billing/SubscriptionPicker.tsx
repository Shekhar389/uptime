import React from 'react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Separator } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPlan } from '../../store/slices/billingSlice';
import { CreditCard, Check } from 'lucide-react';

export const SubscriptionPicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const { plans, currentPlanId } = useAppSelector((state) => state.billing);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="text-emerald-400" size={26} /> Subscription & Quota Limits
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select a subscription tier that scales with your uptime frequency & monitor quota.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = currentPlanId === plan.id;
          return (
            <Card
              key={plan.id}
              className={`bg-slate-900/90 border flex flex-col justify-between transition-all ${
                isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg' : 'border-slate-800'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold text-white">{plan.name}</CardTitle>
                  {isSelected && (
                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Up to {plan.monitorsLimit} monitors with {plan.pingFrequencySeconds}s ping intervals.
                </CardDescription>
                <div className="text-3xl font-extrabold text-white pt-3">
                  ${plan.priceMonthly}
                  <span className="text-sm font-normal text-slate-400">/mo</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <Separator className="bg-slate-800 my-2" />
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className={`w-full ${isSelected ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : ''}`}
                  onClick={() => dispatch(selectPlan(plan.id))}
                >
                  {isSelected ? 'Current Active Plan' : `Switch to ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
