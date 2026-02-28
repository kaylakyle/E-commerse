     <div className="mb-5">
            <Label className="text-sm text-muted-foreground mb-2 block">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button key={r.value} onClick={() => setSelectedRole(r.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all text-sm ${
                    selectedRole === r.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}>
                  <r.icon className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">{r.label}</p>
                    <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Kamau" value={name} onChange={e => setName(e.target.value)} />
              </div>


              