import React from 'react';
import { ShieldCheck, ExternalLink, Globe, Settings2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Separator } from '../../components/ui';

export const StatusPageCustomizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" size={26} /> Public Status Pages
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Customize white-labeled public status dashboards and custom domain routing.
        </p>
      </div>

      <Card className="bg-slate-900/90 border-slate-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="text-cyan-400" size={22} />
              <div>
                <CardTitle className="text-lg font-bold text-white">Default Team Status Page</CardTitle>
                <CardDescription className="text-xs font-mono text-slate-400">status.acme-corp.betterpulse.io</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Live & Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator className="bg-slate-800" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Custom Domain CNAME:</span>
            <span className="font-mono text-xs text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-800">status.acme.com</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-800/60 pt-4">
          <a
            href="http://localhost:3001/api/v1/status-pages"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-medium"
          >
            Visit Live Endpoint <ExternalLink size={14} />
          </a>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 size={14} /> Configure CNAME
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
