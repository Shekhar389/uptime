import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Badge,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMonitor, deleteMonitor, setFilter } from '../../store/slices/uptimeSlice';
import { createMonitorSchema, CreateMonitorInput } from './schemas';
import { Plus, Trash2, Activity, Globe, Clock, ShieldCheck, MoreHorizontal, ExternalLink, RefreshCw } from 'lucide-react';

export const MonitorList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { monitors, filter } = useAppSelector((state) => state.uptime);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateMonitorInput>({
    resolver: zodResolver(createMonitorSchema),
    defaultValues: {
      name: '',
      url: '',
      intervalSeconds: 60,
      status: 'up',
    },
  });

  const onSubmit = (data: CreateMonitorInput) => {
    dispatch(addMonitor(data));
    reset();
    setOpen(false);
  };

  const filteredMonitors = monitors.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const totalUp = monitors.filter((m) => m.status === 'up').length;
  const totalDegraded = monitors.filter((m) => m.status === 'degraded').length;
  const totalDown = monitors.filter((m) => m.status === 'down').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Dialog Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <Activity className="text-zinc-100" size={24} /> Uptime Monitors
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Real-time HTTP health checks, ping latency tracking, and SLA verification.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold shadow-sm">
              <Plus size={16} /> Add Monitor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">Create Health Check</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Configure a target HTTP or HTTPS URL to poll for status code & SLA latency.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Monitor Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Primary API Gateway"
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-100"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="url" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  URL Endpoint
                </Label>
                <Input
                  id="url"
                  placeholder="https://api.acme.com/health"
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-100"
                  {...register('url')}
                  error={errors.url?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="intervalSeconds" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Interval (sec)
                  </Label>
                  <Input
                    id="intervalSeconds"
                    type="number"
                    placeholder="60"
                    className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-100"
                    {...register('intervalSeconds', { valueAsNumber: true })}
                    error={errors.intervalSeconds?.message}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Status
                  </Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-100"
                    onChange={(e) => setValue('status', e.target.value as any)}
                  >
                    <option value="up">Up (Healthy)</option>
                    <option value="degraded">Degraded</option>
                    <option value="down">Down (Outage)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold">
                  Save Monitor
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Active</CardTitle>
            <Globe className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-white font-mono">{monitors.length}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Monitored target URLs</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Healthy (Up)</CardTitle>
            <ShieldCheck className="h-4 w-4 text-zinc-100" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-zinc-100 font-mono">{totalUp}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Passing checks</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Degraded</CardTitle>
            <Clock className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-zinc-300 font-mono">{totalDegraded}</div>
            <p className="text-[11px] text-zinc-500 mt-1">High response latency</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Outages (Down)</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-zinc-400 font-mono">{totalDown}</div>
            <p className="text-[11px] text-zinc-500 mt-1">HTTP errors reported</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b border-zinc-800 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-white">Monitored Endpoints</CardTitle>
            <CardDescription className="text-xs text-zinc-400">Live checks with active status filter</CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800">
            <Button
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-7 text-xs px-2.5 ${filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              onClick={() => dispatch(setFilter('all'))}
            >
              All ({monitors.length})
            </Button>
            <Button
              variant={filter === 'up' ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-7 text-xs px-2.5 ${filter === 'up' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              onClick={() => dispatch(setFilter('up'))}
            >
              Up ({totalUp})
            </Button>
            <Button
              variant={filter === 'down' ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-7 text-xs px-2.5 ${filter === 'down' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              onClick={() => dispatch(setFilter('down'))}
            >
              Down ({totalDown})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/80">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Endpoint Name</TableHead>
                <TableHead className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-zinc-400 text-xs font-medium uppercase tracking-wider">URL</TableHead>
                <TableHead className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Latency</TableHead>
                <TableHead className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Interval</TableHead>
                <TableHead className="text-right text-zinc-400 text-xs font-medium uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-800/80">
              {filteredMonitors.map((m) => (
                <TableRow key={m.id} className="border-zinc-800 hover:bg-zinc-800/40 transition-colors">
                  <TableCell className="font-medium text-zinc-100">{m.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-mono uppercase tracking-wider border ${
                        m.status === 'up'
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                          : m.status === 'degraded'
                          ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">{m.url}</TableCell>
                  <TableCell className="text-zinc-300 font-mono text-xs">
                    {m.latencyMs ? `${m.latencyMs} ms` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs font-mono">{m.intervalSeconds}s</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40 bg-zinc-900 border-zinc-800 text-zinc-100" align="end">
                        <DropdownMenuLabel className="text-[11px] text-zinc-500 uppercase tracking-wider">Manage</DropdownMenuLabel>
                        <DropdownMenuItem className="focus:bg-zinc-800 text-xs cursor-pointer">
                          <RefreshCw size={13} className="mr-2" /> Trigger Check
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="focus:bg-zinc-800 text-xs cursor-pointer"
                          onClick={() => window.open(m.url, '_blank')}
                        >
                          <ExternalLink size={13} className="mr-2" /> Open URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="focus:bg-zinc-800 text-xs text-zinc-400 hover:text-white cursor-pointer"
                          onClick={() => dispatch(deleteMonitor(m.id))}
                        >
                          <Trash2 size={13} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMonitors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                    No monitors found matching the active filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
