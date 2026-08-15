import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Badge,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addIncident, updateIncidentStatus } from '../../store/slices/incidentsSlice';
import { createIncidentSchema, CreateIncidentInput } from './schemas';
import { AlertTriangle, Plus, CheckCircle2, ShieldAlert } from 'lucide-react';

export const IncidentTimeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const { incidents } = useAppSelector((state) => state.incidents);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateIncidentInput>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: {
      title: '',
      severity: 'major',
      status: 'investigating',
      description: '',
    },
  });

  const onSubmit = (data: CreateIncidentInput) => {
    dispatch(addIncident(data));
    reset();
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={26} /> Incidents & On-Call Escalations
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Active incident tracking, automated escalation triggers, and audit log history.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold">
              <Plus size={16} /> Declare Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-rose-400" size={20} /> Declare New Incident
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Broadcast status changes to status page and on-call engineers.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 block">Title</label>
                <Input placeholder="e.g. Stripe Webhook Timeout" {...register('title')} error={errors.title?.message} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 block">Severity</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onChange={(e) => setValue('severity', e.target.value as any)}
                  >
                    <option value="minor">Minor Impact</option>
                    <option value="major">Major Outage</option>
                    <option value="critical">Critical Down</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 block">Status</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onChange={(e) => setValue('status', e.target.value as any)}
                  >
                    <option value="investigating">Investigating</option>
                    <option value="identified">Identified</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 block">Description</label>
                <Input placeholder="Detail impact and steps being taken..." {...register('description')} error={errors.description?.message} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-500">
                  Broadcast Incident
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <Card key={inc.id} className="bg-slate-900/90 border-slate-800 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={inc.severity === 'critical' ? 'destructive' : 'secondary'}
                    className={
                      inc.severity === 'critical'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : inc.severity === 'major'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-800 text-slate-300'
                    }
                  >
                    {inc.severity}
                  </Badge>
                  <CardTitle className="text-base font-bold text-white">{inc.title}</CardTitle>
                </div>
                <span className="text-xs font-mono text-slate-500">{inc.createdAt}</span>
              </div>
              <CardDescription className="text-sm text-slate-300 pt-2">{inc.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Current Status:</span>
                <Badge variant={inc.status === 'resolved' ? 'default' : 'secondary'} className={inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}>
                  {inc.status}
                </Badge>
              </div>
              {inc.status !== 'resolved' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                  onClick={() => dispatch(updateIncidentStatus({ id: inc.id, status: 'resolved' }))}
                >
                  <CheckCircle2 size={14} /> Mark Resolved
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
